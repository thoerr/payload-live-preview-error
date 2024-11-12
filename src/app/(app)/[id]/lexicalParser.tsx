'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const LexicalContent = ({ data = {} }: { data: any; questions?: string[] }) => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const rootNode = data.root || data

  const FORMAT_FLAGS = {
    BOLD: 1,
    ITALIC: 2,
    UNDERLINE: 4,
    STRIKETHROUGH: 8,
    CODE: 16,
    SUBSCRIPT: 32,
    SUPERSCRIPT: 64,
  }

  const applyFormatting = (text: any, format: number) => {
    let formattedText = text

    if (format & FORMAT_FLAGS.BOLD) {
      formattedText = <strong>{formattedText}</strong>
    }
    if (format & FORMAT_FLAGS.ITALIC) {
      formattedText = <em>{formattedText}</em>
    }
    if (format & FORMAT_FLAGS.UNDERLINE) {
      formattedText = <u>{formattedText}</u>
    }
    if (format & FORMAT_FLAGS.STRIKETHROUGH) {
      formattedText = <s>{formattedText}</s>
    }
    if (format & FORMAT_FLAGS.CODE) {
      formattedText = <code>{formattedText}</code>
    }
    if (format & FORMAT_FLAGS.SUBSCRIPT) {
      formattedText = <sub>{formattedText}</sub>
    }
    if (format & FORMAT_FLAGS.SUPERSCRIPT) {
      formattedText = <sup>{formattedText}</sup>
    }

    return formattedText
  }

  const convertNode = (node, index) => {
    switch (node.type) {
      case 'text':
        return (
          <React.Fragment key={index}>{applyFormatting(node.text, node.format)}</React.Fragment>
        )

      case 'paragraph':
        return <p key={index}>{node.children.map(convertNode)}</p>

      case 'horizontalrule':
        return <hr key={index} />

      case 'linebreak':
        return <br key={index} />

      case 'upload':
        const img = node.value
        return isHydrated ? (
          <Image
            key={index}
            style={{ maxWidth: '100%', height: 'auto' }}
            src={img.url}
            width={img.width}
            height={img.height}
            alt={img.text ?? ''}
          />
        ) : null

      case 'heading':
        const HeadingTag = node.tag
        return <HeadingTag key={index}>{node.children.map(convertNode)}</HeadingTag>

      case 'list':
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
        return <ListTag key={index}>{node.children.map(convertNode)}</ListTag>

      case 'listitem':
        return <li key={index}>{node.children.map(convertNode)}</li>

      case 'quote':
        return <blockquote key={index}>{node.children.map(convertNode)}</blockquote>

      case 'link':
        return (
          <a key={index} href={node.url}>
            {node.children.map(convertNode)}
          </a>
        )

      case 'image':
        return <img key={index} src={node.src} alt={node.alt || ''} />

      default:
        return node.children ? node.children.map(convertNode) : null
    }
  }

  return rootNode?.children?.map(convertNode)
}

export const LexicalPreview = ({
  data,
  maxLength = 200,
}: {
  data: { root: object }
  maxLength?: number
}) => {
  const extractText = (node) => {
    if (node.type === 'text') {
      return node.text
    }
    if (node.children && node.children.length) {
      return node.children.map(extractText).join(' ')
    }
    return ''
  }

  const root = data?.root
  if (!root) return ''

  const fullText = extractText(root).trim()
  return fullText.length > maxLength ? `${fullText.slice(0, maxLength)}...` : fullText
}

export default LexicalContent
