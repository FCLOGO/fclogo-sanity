import {defineType, defineField} from 'sanity'
import {PackageIcon} from '@sanity/icons'

export default defineType({
  name: 'package',
  title: '徽标集 (Package)',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({name: 'title', title: '徽标集名称 (Title)', type: 'internationalizedArrayString', validation: Rule => Rule.required()}),
    defineField({name: 'season', title: '赛季 (Season)', type: 'string'}),
    defineField({
      name: 'slug', 
      title: '徽标集链接 Slug', 
      type: 'slug', 
      options: {
        source: (doc: any) => {
          const title = doc.title?.find((t: any) => t._key === 'en')?.value || '';
          return `${doc.season}-${title}`;
        },
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'sourceSubject', 
      title: '所属主体 (Subject)', 
      description: '这个徽标集是关于哪个主体（赛事、协会等）',
      type: 'reference',
      to: [{type: 'comp'}, {type: 'team'}, {type: 'assn'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceLogo',
      title: '主体徽标',
      type: 'reference',
      description: '在上述主体中，选择一个徽标作为这个 Pack 的“封面图”。',
      to: [{type: 'logo'}],
      options: {
        filter: ({document}) => {
          const subjectRef = (document.sourceSubject as {_ref?: string})?._ref;
          if (!subjectRef) {
            return { filter: 'false', params: {} }; // 如果没选主体，则禁用此字段
          }
          return {
            filter: 'subject._ref == $subjectRef && style->value.current == "color"',
            params: { subjectRef },
          };
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: '包含的徽标 (Items)',
      type: 'array',
      description: '将属于这个徽标集的所有徽标添加到这里',
      of: [
        {
          type: 'reference',
          to: [{type: 'logo'}],
          options: {
            filter: 'style->value.current in ["color", "comm", "minor"]',
          },
        },
      ],
      validation: (Rule) => Rule.min(1), // 至少要包含一个徽标
    }),
    defineField({
      name: 'dateOriginal',
      title: '原始创建日期',
      type: 'datetime',
      readOnly: true,
      hidden: ({document}) => !document?.dateOriginal,
    }),
    defineField({
      name: 'legacyPackID',
      title: '旧版 Pack ID',
      type: 'string',
      readOnly: true,
      hidden: ({document}) => !document?.legacyPackID,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      season: 'season',
      media: 'sourceLogo.previewImage',
    },
    prepare({title, season, media}) {
      const enTitle = Array.isArray(title) ? title.find(t => t._key === 'en')?.value : 'No Title';
      return {
        title: enTitle,
        subtitle: `Season: ${season}`,
        media,
      };
    },
  },
})