import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.role === "user") {
    return (
      <div className="w-full py-6">
        <div className="mx-auto flex max-w-3xl justify-end px-4 text-base">
          <div className="max-w-[70%] rounded-3xl bg-gray-100 px-5 py-3">
            <div className="text-gray-900">{message.content}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group w-full py-8">
      <div className="mx-auto max-w-3xl px-4 text-base">
        <div className="flex flex-col gap-4">
          <div className="prose prose-sm max-w-none break-words text-gray-900">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match
                  
                  if (isInline) {
                    return (
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-900" {...props}>
                        {children}
                      </code>
                    )
                  }
                  
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 my-4">
                    {children}
                  </pre>
                ),
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 my-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 my-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-900">
                    {children}
                  </li>
                ),
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="my-2 text-gray-900 leading-7">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border-collapse border border-gray-300">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-4 py-2">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-7 w-7 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              title="Copy"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              title="Like"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              title="Dislike"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
