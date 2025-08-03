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
})