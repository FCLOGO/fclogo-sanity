import {defineType, defineField} from 'sanity'
import {IceCreamIcon} from '@sanity/icons'

export default defineType({
  name: 'logoStyle',
  title: '徽标样式 (Logo Style)',
  type: 'document',
  icon: IceCreamIcon,
  fields: [
    defineField({
      name: 'title',
      title: '样式名称 (Title)',
      description: '例如：单色 (Monochrome)',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: '样式值 (Value)',
      description: 'URL 中使用的值，例如：mono',
      type: 'slug', 
      options: {
        source: (doc) => {
          if (Array.isArray(doc.title)) {
            const englishTitle = doc.title.find(
              (langValue) => langValue._key === 'en'
            )
            return englishTitle?.value || ''
          }
          return ''
        },
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title', 
    },
    prepare(selection) {
      const {title} = selection
      const chineseTitle = Array.isArray(title) ? title.find((langValue) => langValue._key === 'zh-cn')?.value : '没有名称'
      const englishTitle = Array.isArray(title) ? title.find((langValue) => langValue._key === 'en')?.value : 'No Title'
      return {
        title: chineseTitle,
        subtitle: englishTitle, 
      }
    },
  },
})