import { create } from "zustand";

import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface ApiMessage {
  _id: string;
  session_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  createChat: () => string;
  addMessage: (chatId: string, message: Omit<Message, "createdAt">) => void;
  setCurrentChat: (chatId: string) => void;
  updateMessageContent: (
    chatId: string,
    messageId: string,
    content: string
  ) => void;
  loadChatHistory: (
    sessionId: string,
    messages: ApiMessage[],
    title?: string
  ) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  chats: [],
  currentChatId: null,

  createChat: () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      chats: [newChat, ...state.chats],
      currentChatId: newChat.id,
    }));
    return newChat.id;
  },

  addMessage: (chatId, message) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                ...message,
                id: message.id || uuidv4(),
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return chat;
      }),
    }));
  },

  setCurrentChat: (chatId) => set({ currentChatId: chatId }),

  updateMessageContent: (chatId, messageId, content) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) => {
              if (msg.id === messageId) {
                return { ...msg, content };
              }
              return msg;
            }),
          };
        }
        return chat;
      }),
    }));
  },

  loadChatHistory: (sessionId, messages, title = "Chat History") => {
    console.log("loadChatHistory called with:", {
      sessionId,
      messagesCount: messages.length,
      title,
    });
    set((state) => {
      // Check if chat already exists
      const existingChat = state.chats.find((chat) => chat.id === sessionId);
      console.log("Existing chat found:", existingChat ? "Yes" : "No");

      if (existingChat) {
        // Update existing chat with messages
        console.log("Updating existing chat");
        // Sort messages by timestamp in ascending order (oldest first)
        const sortedMessages = [...messages].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        return {
          chats: state.chats.map((chat) =>
            chat.id === sessionId
              ? {
                  ...chat,
                  messages: sortedMessages.map((msg) => ({
                    id: msg._id,
                    role: msg.role as "user" | "assistant",
                    content: msg.content,
                    createdAt: msg.timestamp,
                  })),
                }
              : chat
          ),
          currentChatId: sessionId,
        };
      } else {
        // Create new chat with messages
        console.log("Creating new chat");
        // Sort messages by timestamp in ascending order (oldest first)
        const sortedMessages = [...messages].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const newChat: Chat = {
          id: sessionId,
          title,
          messages: sortedMessages.map((msg) => ({
            id: msg._id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            createdAt: msg.timestamp,
          })),
          createdAt: sortedMessages[0]?.timestamp || new Date().toISOString(),
        };

        console.log("New chat created:", newChat);
        return {
          chats: [newChat, ...state.chats],
          currentChatId: sessionId,
        };
      }
    });
  },
}));
