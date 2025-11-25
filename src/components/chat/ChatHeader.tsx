import { ModelSelector } from "./ModelSelector"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface ChatHeaderProps {
  onToggleSidebar?: () => void
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden -ml-2 text-gray-500"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <ModelSelector />
      </div>
      
      <div className="flex items-center gap-1"></div>
    </header>
  )
}
