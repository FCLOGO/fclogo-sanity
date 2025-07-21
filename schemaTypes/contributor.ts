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
    defineField({name: 'legacyCtrbID', title: '旧版 CtrbID', type: 'string', description: '仅用于数据迁移，请勿手动修改'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})