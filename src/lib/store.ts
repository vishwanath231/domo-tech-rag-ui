import { create } from "zustand";

import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
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
}));
