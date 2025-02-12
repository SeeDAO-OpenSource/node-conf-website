import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import styled from 'styled-components'
import { ChevronDown, ChevronUp } from 'lucide-react'
const Box = styled.div`
  word-break: break-all;
  img {
    max-width: 50vw;
    margin: 0 auto;
  }
  pre {
    white-space: pre-wrap;
  }
`

interface NavItem {
  id: string
  title: string
  file: string
}

const navItems: NavItem[] = [
  { id: 'overview', title: '节点共识大会概述', file: 'overview.md' },
  { id: 'history', title: '历史渊源', file: 'history.md' },
  { id: 'process', title: '会议流程', file: 'process.md' },
  { id: 'rules', title: '参与规则', file: 'rules.md' },
  { id: 'participation', title: '如何参与', file: 'participation.md' },
  { id: 'faq', title: '常见问题', file: 'faq.md' },
  { id: 'metarule', title: '元规则', file: 'metarule.md' },
  { id: 'noderules', title: '节点共识大会规则', file: 'noderules.md' },
]

export default function AboutPage() {
  const { sectionId = 'overview' } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState<string>('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const selectedItem = navItems.find(item => item.id === sectionId)
        if (!selectedItem) {
          navigate('/about/overview')
          return
        }

        let content = ''
        switch (selectedItem.id) {
          case 'overview':
            content = (await import('../../content/about/overview.md?raw')).default
            break
          case 'history':
            content = (await import('../../content/about/history.md?raw')).default
            break
          case 'process':
            content = (await import('../../content/about/process.md?raw')).default
            break
          case 'rules':
            content = (await import('../../content/about/rules.md?raw')).default
            break
          case 'participation':
            content = (await import('../../content/about/participation.md?raw')).default
            break
          case 'faq':
            content = (await import('../../content/about/faq.md?raw')).default
            break
          case 'metarule':
            content = (await import('../../content/about/metarule.md?raw')).default
            break
          case 'noderules':
            content = (await import('../../content/about/noderules.md?raw')).default
            break
          default:
            content = '# Error\nSection not found.'
        }
        setContent(content)
      } catch (error) {
        console.error('Error loading content:', error)
        setContent('# Error\nFailed to load content.')
      }
    }
    loadContent()
    setShow(false)
  }, [sectionId, navigate])

  const handleShow = () => {
    setShow(!show)
  }

  return (
    // <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <Box className=" flex flex-col md:flex-row gap-8">
      <div className=" w-full sticky top-24 h-fit sm:w-64 ">
        {/*<nav className=" top-4 space-y-2 bg-white rounded-lg shadow-lg p-8" aria-label="Sidebar">*/}
        <nav
          className={`bg-white rounded-lg shadow-lg p-6 flex-1 ${show ? 'overflow-auto' : 'h-[75px] overflow-hidden'}  sm:h-auto md:overflow-auto `}
          aria-label="Sidebar"
        >
          <div className="text-xl font-bold mb-6  justify-between flex sm:hidden">
            <div>节点共识大会</div>
            <div className="block sm:hidden" onClick={() => handleShow()}>
              {show ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
          {navItems.map(item => (
            <a
              key={item.id}
              onClick={e => {
                e.preventDefault()
                navigate(`/about/${item.id}`)
              }}
              href={`/about/${item.id}`}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group',
                sectionId === item.id
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
              )}
              aria-current={sectionId === item.id ? 'page' : undefined}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  sectionId === item.id
                    ? 'bg-primary-500 scale-125'
                    : 'bg-gray-300 group-hover:bg-gray-400'
                }`}
              ></span>
              {item.title}
            </a>
          ))}
        </nav>
      </div>
      <main className="space-y-8 bg-white rounded-lg shadow-lg p-8 flex-1 ">
        <div className="prose prose-lg prose-indigo mx-auto text-gray-500">
          <ReactMarkdown
            components={{
              img: ({ node, src, ...props }) => {
                console.log(node)
                const srcURl = src?.startsWith('./')
                  ? `/node-conf-website/images/about/${src.slice(2)}`
                  : `/node-conf-website/images/about/${src}`
                return <img {...props} src={srcURl} />
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </main>
    </Box>
  )
}
