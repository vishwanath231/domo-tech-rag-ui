/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { 
  PenSquare, 
  Search, 
  LogOut, 
  Sparkles, 
  PanelLeft, 
  MessageSquare, 
  Clock,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { useChatStore } from "@/lib/store";
import { useState, useEffect } from "react";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface SidebarContentProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
}

function SidebarContent({
  onToggle,
  isCollapsed = false,
}: SidebarContentProps) {
  const { createChat, loadChatHistory } = useChatStore();
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  const [chatSession, setChatSession] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/chat/${user._id}/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        setChatSession(data?.sessions || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
        setIsLoading(false);
      });
  }, [user._id]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).google?.accounts?.id?.disableAutoSelect();
    window.location.reload();
  };


  const handleChatHistoryClick = (sessionId: string, title: string) => {
    localStorage.setItem("session_id", sessionId);

    // Fetch messages for the selected session
    fetch(`http://127.0.0.1:8000/chat/${sessionId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // Load the chat history into the store
        // API returns {messages: [...]} instead of [...]
        const messages = Array.isArray(data) ? data : data?.messages;
        
        if (messages && Array.isArray(messages)) {
          loadChatHistory(sessionId, messages, title);
        } else {
          console.warn("Data is not an array or is null:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const handleDeleteChat = (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/chat/${sessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          // Remove from local state
          setChatSession((prev: any) => prev.filter((s: any) => s._id !== sessionId));
          
          // If deleted chat was active, clear session_id
          if (localStorage.getItem("session_id") === sessionId) {
            localStorage.removeItem("session_id");
            createChat(); // Create a new chat
          }
        } else {
          console.error("Failed to delete chat");
        }
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
      });
  };
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div
        className={cn(
          "flex h-14 items-center px-3",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
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
              createChat();
              localStorage.removeItem("session_id");
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
            {/* Chat Session History */}
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2 px-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Recent Chats
                </h3>
              </div>
              
              <div className="space-y-1">
                {isLoading ? (
                  // Loading skeleton
                  <>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
                      </div>
                    ))}
                  </>
                ) : chatSession && chatSession.length > 0 ? (
                  chatSession.map((session: any, index: number) => (
                    <div
                      key={session._id || index}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-1.5 text-gray-700 transition-all hover:bg-gray-100",
                        localStorage.getItem("session_id") === session._id && "bg-gray-100 text-gray-900"
                      )}
                    >
                      <button
                        className="flex flex-1 items-center gap-3 text-left"
                        onClick={() => handleChatHistoryClick(session._id, session.title || "Untitled Chat")}
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                        <span className="flex-1 truncate text-sm text-black font-normal">
                          {session.title || "Untitled Chat"}
                        </span>
                      </button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            className="gap-2 text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteChat(session._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center">
                    <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="text-xs text-gray-400">No chat history yet</p>
                    <p className="mt-1 text-xs text-gray-400">Start a new conversation</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Menu */}
      <div className="border-t border-gray-200 px-2 py-4">
        {isCollapsed ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center px-2 py-2 hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-orange-400 text-white text-sm">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end" side="right">
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-orange-400 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="truncate text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 text-gray-900 cursor-pointer"
                  onClick={logout}
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
                className="w-full justify-start gap-3 p-4 hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-orange-400 text-white text-sm">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start overflow-hidden">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-gray-500">
                    {user.email}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end" side="top">
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-orange-400 text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 text-gray-900 cursor-pointer"
                  onClick={logout}
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
  );
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
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300 md:relative md:z-0",
          // Mobile: Slide in/out
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Width handling
          isOpen ? "w-[260px]" : "w-[260px] md:w-[68px]",
          className
        )}
      >
        <SidebarContent onToggle={onToggle} isCollapsed={!isOpen} />
      </div>
    </>
  );
}
