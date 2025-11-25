import { ChatMessage } from "./ChatMessage"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatListProps {
  messages: Message[]
  isTyping?: boolean
}

export function ChatList({ messages, isTyping }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const prevMessagesLength = useRef(messages.length)

  // Check if user is near bottom
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShouldAutoScroll(isNearBottom)
      setShowScrollButton(!isNearBottom && messages.length > 0)
    }
  }

  // Auto-scroll only when new messages arrive and user is near bottom
  useEffect(() => {
    if (messages.length > prevMessagesLength.current && shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    prevMessagesLength.current = messages.length
  }, [messages, shouldAutoScroll])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  console.log(messages)

  return (
    <div className="relative flex-1 overflow-hidden">
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto" 
        onScroll={handleScroll}
      >
        <div className="flex flex-col">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="w-full py-8">
              <div className="mx-auto max-w-3xl px-4 text-base">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-8" />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
          <Button
            onClick={scrollToBottom}
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
