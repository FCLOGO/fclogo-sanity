import {defineType, defineField} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {LogoSlugInput} from '../components/LogoSlugInput'

export default defineType({
  name: 'logo',
  title: '徽标 (Logo)',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'subject', 
      title: '所属主体 (Subject)', 
      type: 'reference', 
      to: [
        {type: 'club'},
        {type: 'comp'},
        {type: 'team'},
        {type: 'assn'},
      ], 
      validation: Rule => Rule.required()
    }),
    defineField({name: 'version', title: '版本 (Version)', type: 'number',
      description: '输入徽标启用的年份 (YYYY) 或 年份.月份 (YYYY.MM)，不确定则填 0',
      initialValue: 0,
      validation: (Rule) => Rule.custom((value) => {
        if (typeof value === 'undefined') {
          return true // 如果字段为空，则不进行验证 (由 initialValue 处理)
        }
        if (value === 0) {
          return true
        }
        if (typeof value !== 'number') {
          return '必须是数字'
        }

        const year = Math.floor(value)
        const monthPart = Number(value.toFixed(2).split('.')[1] || 0)

        if (year < 1800 || year > new Date().getFullYear() + 5) {
          return '请输入一个合理的年份'
        }
        if (monthPart > 0 && (monthPart < 1 || monthPart > 12)) {
          return '月份必须在 1 到 12 之间 (例如: 2000.01 或 2000.12)'
        }
        return true
      }),
    }),
    defineField({name: 'style', title: '样式 (Style)', type: 'reference', to: [{type: 'logoStyle'}], validation: Rule => Rule.required()}),
    defineField({
      name: 'previewImage',
      title: '预览图 (for Web Display)',
      type: 'image',
      description: '上传高质量版本，用于在网站上生成各种尺寸的预览图。',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({name: 'pngUrl', title: 'PNG 下载链接 (from R2)', type: 'url', description: '指向 Cloudflare R2 中原始 PNG 文件的公开链接。', validation: Rule => Rule.required()}),
    defineField({name: 'svgUrl', title: 'SVG 下载链接 (from R2)', type: 'url', description: '指向 Cloudflare R2 中原始 SVG 文件的公开链接。', validation: Rule => Rule.required()}),
    defineField({name: 'isBgDark', title: '使用深色背景', type: 'boolean', initialValue: false}),
    defineField({name: 'isOutdated', title: '是否为历史徽标', type: 'boolean', initialValue: false}),
    defineField({name: 'isDoubtful', title: '信息是否存在疑问', type: 'boolean', initialValue: false}),
    defineField({name: 'alternateNames', title: '曾用名 (Alternate Names)', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'referenceInfo', title: '参考资料 (Reference)', type: 'url'}),
    defineField({name: 'contributor', title: '贡献者 (Contributor)', type: 'reference', to: [{type: 'contributor'}]}),
    defineField({name: 'slug', title: '徽标详情页链接 Slug', type: 'slug',
      components: {
        input: LogoSlugInput, 
      }, validation: Rule => Rule.required()}),
    defineField({
      name: 'dateOriginal',
      title: '原始创建日期 (Original Date)',
      type: 'datetime',
      description: '仅用于迁移数据，由系统自动填充，请勿手动修改。',
      readOnly: true, 
      hidden: ({document}) => !document?.dateOriginal, 
    }),
    defineField({name: 'legacyLogoID', title: '旧版 Logo ID', type: 'string', description: '仅用于数据迁移，请勿手动修改', readOnly: true, hidden: ({document}) => !document?.legacyLogoID}),
  ],
  preview: {
    select: {
      title: 'subject.name',
      version: 'version',
      style: 'style.title',
      media: 'previewImage',
    },
    prepare(selection) {
      const {title, version, style} = selection
      const chineseTitle = Array.isArray(title) ? title.find((langValue) => langValue._key === 'zh-cn')?.value : '没有名称'
      const chineseStyle = Array.isArray(style) ? style.find((langValue) => langValue._key === 'zh-cn')?.value : '没有样式'
      return {
        title: chineseTitle,
        subtitle: `v${version || '0000'}  ${chineseStyle || ''}`,
        media: selection.media, 
      }
    },
  },
})