import {defineType, defineField} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export default defineType({
  name: 'link',
  title: '链接 (Link)',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({name: 'name', title: '名称 (Name)', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'url', title: '链接 (URL)', type: 'url', validation: Rule => Rule.required()}),
    defineField({name: 'description', title: '描述 (Description)', type: 'text'}),
    defineField({name: 'logo', title: '标志 (Logo)', type: 'image'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})