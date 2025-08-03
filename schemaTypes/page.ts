import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export default defineType({
  name: 'page',
  title: '页面 (Page)',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'title', title: '页面标题 Title', type: 'internationalizedArrayString'}),
    defineField({
      name: 'slug',
       title: '页面链接 Slug', 
       type: 'slug',
       options: {
        source: 'title.0.value', // .0.value 意为从 title 数组的第一个对象中取 value
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      }),
    defineField({
      name: 'enContent', 
      title: '页面内容 (English)', 
      type: 'array',
      of: [
        {type: 'block'}
      ]}),
    defineField({
      name: 'zhContent', 
      title: '页面内容 (简体中文)', 
      type: 'array',
      of: [
        {type: 'block'},
      ]
    }),
    defineField({
      name: 'timeline', 
      title: '里程碑事件 (Timeline)', 
      type: 'object',
      fields: [
        { name: 'events', type: 'array', of: [{type: 'timelineEvent'}] }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      const chineseTitle = Array.isArray(title) ? title.find((langValue) => langValue._key === 'zh-cn')?.value : '没有名称'
      return {
        title: chineseTitle,
      }
    }
  },
})