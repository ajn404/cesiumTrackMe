import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGithub, { defaultBuildUrl } from 'remark-github'
import remarkToc from 'remark-toc'

export function Documentation() {
  const { page } = useParams()
  const [content, setContent] = useState('')

  useEffect(() => {
    // 直接使用 fetch 加载 markdown 文件
    fetch(`${import.meta.env.BASE_URL}/docs/${page}.md`)
      .then(res => {
        if (!res.ok) {
          throw new Error('文档未找到')
        }
        return res.text()
      })
      .then(text => setContent(text))
      .catch(() => setContent('文档加载失败，请检查文档是否存在'))
  }, [page])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="flex items-center gap-2 text-3xl font-bold mb-8">
        <FileText className="w-8 h-8" />
        文档 - {page}
      </h1>
      <div>
        <ReactMarkdown
          remarkPlugins={[
            [remarkToc, {          // 插入目录
              heading: '目录',         // 指定目录标题
              tight: true              // 紧凑模式
            }],
            remarkGfm,
            remarkMath,
            [remarkGithub, {
              repository: 'ajn404/cesiumTrackMe',
              buildUrl(values) {
                return values.type === 'mention'
                  ? `http://ajn404.github.io/cesiumTrackMe/${values.user}/`
                  : defaultBuildUrl(values)
              }
            }]
          ]}
          rehypePlugins={[rehypeHighlight, rehypeKatex]}
          components={{
            a({ node, href, children, ...props }) {
              if (href?.startsWith('#')) {
                return (
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault()
                      // 对 href 进行 CSS 选择器转义
                      const selector = href.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&')
                      const target = document.querySelector(selector)
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    {...props}
                  >
                    {children}
                  </a>
                )
              }
              return <a href={href} {...props}>{children}</a>
            },
            h1({ node, children, ...props }) {
              return (
                <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>
                  {children}
                </h1>
              )
            },
            h2({ node, children, ...props }) {
              return (
                <h2 className="text-2xl font-bold mt-8 mb-4" {...props}>
                  {children}
                </h2>
              )
            },
            h3({ node, children, ...props }) {
              return (
                <h3 className="text-xl font-semibold mt-6 mb-3" {...props}>
                  {children}
                </h3>
              )
            },
            p({ node, children, ...props }) {
              return (
                <p className="leading-relaxed mb-4" {...props}>
                  {children}
                </p>
              )
            },
            code({ node, className, children, ...props }) {
              const inline = (props as { inline?: boolean }).inline;
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-gray-900 dark:bg-gray-500 px-4 py-2 text-sm text-gray-400 dark:text-gray-300">
                    {match[1]}
                  </div>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              ) : (
                <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}