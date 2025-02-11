import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
    <div className="p-8 prose max-w-full">
      <h1 className="flex items-center gap-2">
        <FileText className="w-6 h-6" />
        文档 - {page}
      </h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}