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
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
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
  Trash2,
  X,
} from "lucide-react";
import { useChatStore } from "@/lib/store";
import { useState, useEffect, useMemo } from "react";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Helper function to group chats by time period
  const getTimeGroup = (createdAt: string) => {
    const now = new Date();
    const chatDate = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - chatDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return "Previous 7 Days";
    if (diffDays <= 30) return "Previous 30 Days";
    return "Older";
  };

  // Filter and group chats based on search query
  const filteredAndGroupedChats = useMemo(() => {
    const filtered = chatSession.filter((session: any) =>
      session.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped: Record<string, any[]> = {};
    filtered.forEach((session: any) => {
      const group = getTimeGroup(session.createdAt);
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(session);
    });

    return grouped;
  }, [chatSession, searchQuery]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("session_id");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).google?.accounts?.id?.disableAutoSelect();
    window.location.reload();
  };

  const handleChatHistoryClick = (sessionId: string, title: string, closeModal = false) => {
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
          if (closeModal) {
            setIsSearchOpen(false);
            setSearchQuery("");
          }
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
          setChatSession((prev: any) =>
            prev.filter((s: any) => s._id !== sessionId)
          );

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
              "cursor-pointer w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100",
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
              "cursor-pointer w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Search chats" : undefined}
            onClick={() => setIsSearchOpen(true)}
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
                        localStorage.getItem("session_id") === session._id &&
                          "bg-gray-100 text-gray-900"
                      )}
                    >
                      <button
                        className="flex flex-1 items-center gap-3 text-left min-w-0 cursor-pointer"
                        onClick={() =>
                          handleChatHistoryClick(
                            session._id,
                            session.title || "Untitled Chat"
                          )
                        }
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />

                        <span className="flex-1 text-sm font-normal text-black truncate">
                          {session.title || "Untitled Chat"}
                        </span>
                      </button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
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
                    <p className="mt-1 text-xs text-gray-400">
                      Start a new conversation
                    </p>
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
                  <AvatarFallback className="bg-[#99ccee] text-white text-sm">
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
                      <AvatarFallback className="bg-[#99ccee] text-white">
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
                className="w-full justify-start gap-3 py-8 hover:bg-gray-100 cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-[#99ccee] text-white text-sm">
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
                      <AvatarFallback className="bg-[#99ccee] text-white">
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

      {/* Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0" showCloseButton={false}>
          <DialogHeader className="p-0">
            <div className="relative border-b border-gray-200">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 pr-12 text-base outline-none"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            {/* New Chat Button */}
            <div className="border-b border-gray-200 p-3">
              <Button
                variant="ghost"
                className="cursor-pointer w-full justify-start gap-3 px-3 text-gray-900 hover:bg-gray-100"
                onClick={() => {
                  createChat();
                  localStorage.removeItem("session_id");
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                <PenSquare className="h-5 w-5" />
                <span>New chat</span>
              </Button>
            </div>

            {/* Grouped Chat History */}
            <div className="p-3">
              {Object.keys(filteredAndGroupedChats).length > 0 ? (
                Object.entries(filteredAndGroupedChats).map(([group, sessions]) => (
                  <div key={group} className="mb-4">
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {group}
                    </h3>
                    <div className="space-y-1">
                      {sessions.map((session: any) => (
                        <button
                          key={session._id}
                          className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-gray-700 transition-all hover:bg-gray-100"
                          onClick={() =>
                            handleChatHistoryClick(
                              session._id,
                              session.title || "Untitled Chat",
                              true
                            )
                          }
                        >
                          <MessageSquare className="h-4 w-4 flex-shrink-0 text-gray-400" />
                          <span className="flex-1 truncate text-sm">
                            {session.title || "Untitled Chat"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-8 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    {searchQuery ? "No chats found" : "No chat history yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
