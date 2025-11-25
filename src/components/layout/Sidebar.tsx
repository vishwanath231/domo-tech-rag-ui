import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { 
  PenSquare, 
  Search, 
  LogOut,
  Sparkles,
  PanelLeft
} from "lucide-react"
import { useChatStore } from "@/lib/store"

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onToggle?: () => void
}

interface SidebarContentProps {
  onToggle?: () => void
  isCollapsed?: boolean
}

function SidebarContent({ onToggle, isCollapsed = false }: SidebarContentProps) {
  const { createChat } = useChatStore()
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className={cn(
        "flex h-14 items-center px-3",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#99ccee]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-gray-600 hover:bg-gray-100"
          onClick={onToggle}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "New chat" : undefined}
            onClick={() => {
              createChat()
            }}
          >
            <PenSquare className="h-5 w-5" />
            {!isCollapsed && <span>New chat</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Search chats" : undefined}
          >
            <Search className="h-5 w-5" />
            {!isCollapsed && <span>Search chats</span>}
          </Button>
        </div>

        {!isCollapsed && (
          <>
            {/* GPTs Section */}
            {/* <div className="mt-6">
              <div className="px-3 pb-2 text-xs font-medium text-gray-500">GPTs</div>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100"
                >
                  <Grid3x3 className="h-5 w-5" />
                  <span>Explore</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100"
                >
                  <div className="h-5 w-5 rounded bg-gradient-to-br from-purple-400 to-pink-400" />
                  <span>Software Architect GPT</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100"
                >
                  <div className="h-5 w-5 rounded bg-gradient-to-br from-orange-400 to-red-400" />
                  <span>AI Humanizer</span>
                </Button>
              </div>
            </div> */}

            {/* Projects Section */}
            {/* <div className="mt-6">
              <div className="px-3 pb-2 text-xs font-medium text-gray-500">Projects</div>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100"
                >
                  <FolderOpen className="h-5 w-5" />
                  <span>New project</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100"
                >
                  <FolderOpen className="h-5 w-5" />
                  <span>RAG</span>
                </Button>
              </div>
            </div> */}
          </>
        )}
      </div>

      {/* User Menu */}
      <div className="border-t border-gray-200 p-2">
        {isCollapsed ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-center px-0 hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-orange-400 text-white text-sm">VA</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end" side="right">
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-orange-400 text-white">VA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium text-gray-900">Vishwanath A</div>
                      <div className="truncate text-sm text-gray-500">@vishwanathvishwabai</div>
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-200" />
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 px-3 text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 px-3 hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-orange-400 text-white text-sm">VA</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start overflow-hidden">
                  <span className="truncate text-sm font-medium text-gray-900">Vishwanath A</span>
                  <span className="truncate text-xs text-gray-500">@vishwanathvishwabai</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end" side="top">
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-orange-400 text-white">VA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium text-gray-900">Vishwanath A</div>
                      <div className="truncate text-sm text-gray-500">@vishwanathvishwabai</div>
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-200" />
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 px-3 text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}

export function Sidebar({ className, isOpen = true, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onToggle}
      />

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300 md:relative md:z-0",
        // Mobile: Slide in/out
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        // Width handling
        isOpen ? "w-[260px]" : "w-[260px] md:w-[68px]",
        className
      )}>
        <SidebarContent onToggle={onToggle} isCollapsed={!isOpen} />
      </div>
    </>
  )
}
