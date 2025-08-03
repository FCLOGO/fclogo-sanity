import {defineType, defineField} from 'sanity'
import {TimelineIcon} from '@sanity/icons'

export default defineType({
  name: 'timelineEvent',
  title: '时间线事件',
  type: 'object',
  icon: TimelineIcon,
  fields: [
    defineField({name: 'date', title: '日期 (Date)', type: 'date', validation: (Rule) => Rule.required()}),
    defineField({name: 'content', title: '内容 (Content)', type: 'internationalizedArrayString', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {
      date: 'date',
      content: 'content',
    },
    prepare(selection) {
      const {date, content} = selection
      const chineseTitle = Array.isArray(content) ? content.find((langValue) => langValue._key === 'zh-cn')?.value : '没有名称'
      return {
        title: `${date}`,
        subtitle: chineseTitle,
      }
    },
  },
})