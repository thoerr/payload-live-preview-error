import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from 'payload.config'
import { RefreshRouteOnSave } from './RefreshRouteOnSave.tsx'
import RenderPage from './RenderPage'

const Page = async ({ params }) => {
  const { id } = await params
  const payload = await getPayloadHMR({ config })

  const data = await payload.findByID({
    collection: 'pages',
    id,
    depth: 2,
  })

  return (
    <div>
      <RenderPage initialData={data} />
    </div>
  )
}

export default Page
