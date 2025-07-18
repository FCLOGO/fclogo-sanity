import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons'

export default defineType({
  name: 'contributor',
  title: '贡献者 (Contributor)',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', title: '名称 (Name)', type: 'string', validation: Rule => Rule.required()}),
    defineField({name: 'avatar', title: '头像 (Avatar)', type: 'image'}),
    defineField({name: 'profileUrl', title: '个人主页 (Profile URL)', type: 'url'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})