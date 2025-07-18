import {Stack, Button, TextInput} from '@sanity/ui'
import {set, unset, SlugInputProps, useFormValue} from 'sanity'
import {useCallback, useState} from 'react'
import {useClient} from 'sanity'

export function LogoSlugInput(props: SlugInputProps) {
  const {onChange, value} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const [isLoading, setIsLoading] = useState(false)

  const subjectRef = useFormValue(['subject', '_ref']) as string | undefined
  const version = useFormValue(['version']) as number | undefined
  const styleRef = useFormValue(['style', '_ref']) as string | undefined

  const generateSlug = useCallback(async () => {
    if (!subjectRef) {
      alert('请先选择一个所属主体 (Subject)！')
      return
    }

    setIsLoading(true)

    try {
      const query = `
        {
          "subject": *[_id == $subjectId][0]{
            "name": name[_key == "en"][0].value,
            "type": type,
            "associationCode": assn
          },
          "styleValue": *[_id == "drafts." + $styleId || _id == $styleId][0].value.current
        }
      `
      const params = {
        subjectId: subjectRef,
        styleId: styleRef,
      }

      const {subject, styleValue} = await client.fetch(query, params)

      if (!subject?.name) {
        alert('无法获取主体名称，请确保主体已保存并有关联的英文名。')
        setIsLoading(false)
        return
      }

      const association = subject.associationCode ? subject.associationCode.toLowerCase() : 'intl'
      const type = subject.type || ''
      const nameSlug = subject.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const versionSlug = String(version || '0000').replace('.', '-')
      const styleSlug = styleValue || 'color'

      let filename = `${nameSlug}-v${versionSlug}`
      if (styleSlug !== 'color') {
        filename += `-${styleSlug}`
      }
      const finalSlug = `/${association}/${type}/${filename}`
      onChange(set({_type: 'slug', current: finalSlug}))
    } catch (error) {
      console.error(error)
      alert('生成 Slug 时出错，请查看控制台信息。')
    } finally {
      setIsLoading(false)
    }
  }, [client, onChange, subjectRef, version, styleRef])

  return (
    <Stack space={2}>
      <TextInput
        value={value?.current || ''}
        onChange={(event) => {
          const newSlug = event.currentTarget.value
          onChange(newSlug ? set({_type: 'slug', current: newSlug}) : unset())
        }}
      />
      <Button
        onClick={generateSlug}
        text="根据主体信息生成"
        mode="ghost"
        disabled={isLoading}
        loading={isLoading}
      />
    </Stack>
  )
}