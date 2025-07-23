import {defineType, defineField} from 'sanity'
import {BookmarkIcon} from '@sanity/icons'

export default defineType({
  name: 'club',
  title: '俱乐部 (Club)',
  type: 'document',
  icon: BookmarkIcon,
  fields: [
    defineField({name: 'name', title: '全称 (Full Name)', type: 'internationalizedArrayString', validation: Rule => Rule.required()}),
    // defineField({name: 'slug', title: '主体页面链接 Slug', type: 'slug',
    //   options: {
    //     source: (doc) => {
    //       if (Array.isArray(doc.name)) {
    //         const englishName = doc.name.find(
    //           (langValue) => langValue._key === 'en'
    //         )
    //         return englishName?.value || ''
    //       }
    //       return ''
    //     },
    //   }, 
    //   validation: Rule => Rule.required()
    // }),
    defineField({name: 'status', title: '状态 (Status)', type: 'string', options: {
        list: [
          {title: '运营中 Active', value: 'active'},
          {title: '停止运营 Inactive', value: 'inactive'},
        ],
        layout: 'radio',
      }, initialValue: 'active'}),
    defineField({name: 'nation', title: '国家 (Nation)', type: 'reference', to: [{type: 'nation'}], validation: Rule => Rule.required()}),
    defineField({name: 'ctgy', title: '所属分类 (Category)', description: '所属协会名称缩写, 用于生成 URL, 例如: CFA、DFB...', type: 'string'}),
    defineField({name: 'location', title: '地理坐标 (Location)', type: 'geopoint', validation: Rule => Rule.required()}),
    defineField({
      name: 'info',
      title: '详细信息 (Info)',
      type: 'object',
      fields: [
        defineField({name: 'shortName', title: '简称 (Short Name)', type: 'internationalizedArrayString'}),
        defineField({name: 'localName', title: '本地名称 (Local Name)', type: 'string'}),
        defineField({name: 'founded', title: '创立年份 (Founded)', type: 'number'}),
        defineField({name: 'city', title: '城市 (City)', type: 'internationalizedArrayString'}),
        defineField({
          name: 'ground', 
          title: '主场 (Ground)', 
          type: 'internationalizedArrayString',
          hidden: ({document}) => (document?.status === 'inactive'),
        }),
        defineField({
          name: 'duration',
          title: '运营时间 (Duration)',
          type: 'string',
          description: '例如: 1905-2022',
          hidden: ({document}) => !(document?.status === 'inactive'),
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: '相关链接 (Links)',
      type: 'object',
      fields: [
        defineField({name: 'websiteURL', title: '官方网站', type: 'url'}),
        defineField({name: 'weiboURL', title: '微博', type: 'url'}),
        defineField({name: 'twitterURL', title: 'X/Twitter', type: 'url'}),
        defineField({name: 'wikiURL', title: '维基百科', type: 'url'}),
      ],
    }),
    defineField({name: 'timelineComplete', title: '时间线是否完成', type: 'boolean', initialValue: false}),
    defineField({name: 'legacySourceID', title: '旧版 Source ID', type: 'string', description: '仅用于数据迁移，请勿手动修改', readOnly: true, hidden: ({document}) => !document?.legacySourceID}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'nation.flagSquare',
    },
    prepare(selection) {
      const {title, media} = selection
      const chineseTitle = Array.isArray(title) ? title.find((langValue) => langValue._key === 'zh-cn')?.value : '没有名称'
      const englishTitle = Array.isArray(title) ? title.find((langValue) => langValue._key === 'en')?.value : 'No Title'
      return {
        title: chineseTitle,
        subtitle: englishTitle,
        media, 
      }
    },
  },
})