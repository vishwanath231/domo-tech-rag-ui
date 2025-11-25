import { Sidebar } from "@/components/layout/Sidebar"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatList } from "@/components/chat/ChatList"
import { ChatInput } from "@/components/chat/ChatInput"
import { WelcomeScreen } from "@/components/chat/WelcomeScreen"
import { useChatStore } from "@/lib/store"
import { streamResponse } from "@/lib/ai-service"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

function App() {
  const { 
    chats, 
    currentChatId, 
    createChat, 
    addMessage, 
    updateMessageContent
  } = useChatStore()

  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const currentChat = chats.find(chat => chat.id === currentChatId)

  // Create initial chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createChat()
    }
  }, [chats.length, createChat])

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return

    // Add user message
    const userMessageId = uuidv4()
    addMessage(currentChatId, {
      id: userMessageId,
      role: "user",
      content,
    })

    // Add assistant message placeholder
    const assistantMessageId = uuidv4()
    addMessage(currentChatId, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    })

    setIsTyping(true)

    try {
      // Stream the response
      let fullResponse = ""
      await streamResponse(content, (chunk) => {
        setIsTyping(false)
        fullResponse += chunk
        updateMessageContent(currentChatId, assistantMessageId, fullResponse)
      })
    } catch (error) {
      console.error("Error streaming response:", error)
      updateMessageContent(
        currentChatId,
        assistantMessageId,
        "Sorry, I encountered an error. Please try again."
      )
    } finally {
      setIsTyping(false)
    }
  }

  // The store's addMessage currently returns void.
  // I should have made it return the ID.
  // OR, I can just rely on the fact that it's the last message.
  
  // Actually, looking at my store implementation:
  // addMessage: (chatId, message) => { ... id: uuidv4() ... }
  // It generates the ID internally.
  
  // To make this work properly with streaming, I should probably modify the store 
  // to allow passing an ID, OR return the ID.
  
  // For now, I'll implement a workaround in handleSendMessage:
  // I will modify the store to accept an ID in addMessage.
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex flex-1 flex-col">
        <ChatHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          {currentChat && currentChat.messages.length > 0 ? (
            <ChatList messages={currentChat.messages} isTyping={isTyping} />
          ) : (
            <WelcomeScreen />
          )}
        </div>
        <div className="bg-white py-4">
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>
      </main>
    </div>
  )
}

export default App
