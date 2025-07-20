import {defineType, defineField} from 'sanity'
import {TiersIcon} from '@sanity/icons'

export default defineType({
  name: 'assn',
  title: '协会 (Association)',
  type: 'document',
  icon: TiersIcon,
  fields: [
    defineField({name: 'name', title: '全称 (Full Name)', type: 'internationalizedArrayString', validation: Rule => Rule.required()}),
    defineField({name: 'nation', title: '国家 (Nation)', type: 'reference', to: [{type: 'nation'}]}),
    defineField({name: 'ctgy', title: '所属分类 (Category)', description: '所属联盟名称缩写, 用于生成 URL, 例如: UEFA、AFC...', type: 'string'}),
    defineField({
      name: 'info',
      title: '详细信息 (Info)',
      type: 'object',
      fields: [
        defineField({name: 'shortName', title: '简称 (Short Name)', type: 'internationalizedArrayString'}),
        defineField({name: 'localName', title: '本地名称 (Local Name)', type: 'string'}),
        defineField({name: 'founded', title: '创立年份 (Founded)', type: 'number'}),
        defineField({name: 'headquarter', title: '总部 (Headquarter)', description: '协会/联盟总部所在地区', type: 'internationalizedArrayString'}),
        defineField({name: 'affiliations', title: '隶属于 (Affiliations)', description: '隶属于联盟名称缩写, 例如: UEFA、AFC...', type: 'string'}),
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
    defineField({name: 'legacySourceID', title: '旧版 Source ID', type: 'string', description: '仅用于数据迁移，请勿手动修改'}),
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