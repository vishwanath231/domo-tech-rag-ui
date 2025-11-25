import { Button } from "@/components/ui/button"
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { useState } from "react"

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
          <div className="prose prose-sm max-w-none break-words">
            <div className="whitespace-pre-wrap text-gray-900">
              {message.content}
            </div>
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
