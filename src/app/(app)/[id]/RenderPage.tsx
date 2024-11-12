'use client'

import React from 'react'
import LexicalContent from './lexicalParser'
import { useLivePreview } from '@payloadcms/live-preview-react'

const RenderPage = ({ initialData }) => {
  console.log('INITIAL DATA', initialData)
  const { data } = useLivePreview({
    initialData: initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
    depth: 2,
  })

  console.log('DATA', data)

  return <LexicalContent data={data.content} />
}

export default RenderPage
