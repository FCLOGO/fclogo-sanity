import {defineType, defineField} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons'

export default defineType({
  name: 'nation',
  title: '国家 (Nation)',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({name: 'name', title: '名称 (Name)', type: 'internationalizedArrayString', validation: (Rule) => Rule.required()}),
    defineField({name: 'code', title: '三字母代码 (Code)', type: 'string', validation: Rule => Rule.required().max(3)}),
    defineField({name: 'center', title: '地图中心坐标', type: 'geopoint'}),
    defineField({name: 'zoom', title: '地图缩放级别', type: 'number'}),
    defineField({name: 'flagSquare', title: '正方形国旗', type: 'image'}),
    defineField({name: 'flagRectangle', title: '长方形国旗', type: 'image'}),
  ],
  preview: {
    select: {
      title: 'name', 
      media: 'flagSquare',
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