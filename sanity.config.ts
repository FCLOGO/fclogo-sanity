import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

export default defineConfig({
  name: 'default',
  title: 'FCLOGO DB',

  projectId: '11hmdf08',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(), 
    internationalizedArray({
      languages: [
        {id: 'en', title: 'English'},
        {id: 'zh-cn', title: '简体中文'},
      ],
      defaultLanguages: ['en'],
      fieldTypes: ['string', 'text'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
