import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp, Plus, Mic, Volume2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 rounded-[26px] bg-white px-4 py-3 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-shadow focus-within:shadow-[0_0_20px_rgba(0,0,0,0.15)]">
          {/* Plus Icon */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={disabled}
            className="min-h-[24px] max-h-[200px] shadow-none resize-none border-0 bg-transparent px-3 py-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
            rows={1}
          />

          {/* Right Icons */}
          <div className="flex shrink-0 items-center gap-1">
            {message.trim() ? (
              <Button
                type="submit"
                size="icon"
                disabled={disabled}
                className="h-8 w-8 rounded-full bg-[#99ccee] text-white hover:bg-[#7ab8e0] disabled:bg-gray-200 disabled:text-gray-400"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
      <div className="mt-2 text-center text-xs text-gray-500">
        ChatGPT can make mistakes. Check important info.
      </div>
    </div>
  )
}
