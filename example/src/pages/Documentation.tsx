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

export function Documentation() {
  const { page } = useParams()
  const [content, setContent] = useState('')

  useEffect(() => {
    // 直接使用 fetch 加载 markdown 文件
    fetch(`/${page}.md`)
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
    <div>
      <h1 className="flex items-center gap-2">
        <FileText className="w-6 h-6" />
        文档 - {page}
      </h1>
      <ReactMarkdown
        remarkPlugins={[
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
          code({ node, className, children, ...props }) {
            const inline = (props as { inline?: boolean }).inline;
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400">
                  {match[1]}
                </div>
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}