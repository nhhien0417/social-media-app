import { create } from 'zustand'
import { Chat } from '@/types/Chat'
import { Message } from '@/types/Message'
import {
  getUserChatsApi,
  getChatDetailApi,
  createGetChatApi,
  deleteChatApi,
  sendMessageApi,
  getMessagesApi,
  deleteMessageApi,
  markAsReadApi,
} from '@/api/api.chat'

interface ChatState {
  // State
  chats: Chat[]
  currentChat: Chat | null

  // Cache State: Messages mapped by chatId
  messagesByChatId: Record<string, Message[]>

  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Pagination State
  chatsPagination: {
    page: number
    hasNext: boolean
  }

  // Pagination by Chat
  paginationByChatId: Record<
    string,
    {
      page: number
      hasNext: boolean
    }
  >

  // Actions
  fetchChats: (refresh?: boolean) => Promise<void>
  fetchChatDetail: (chatId: string) => Promise<void>
  createGetChat: (recipientId: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>

  fetchMessages: (chatId: string, refresh?: boolean) => Promise<void>
  sendMessage: (
    data: { chatId: string; content?: string },
    file?: { uri: string; name: string; type: string }
  ) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  markAsRead: (chatId: string) => Promise<void>

  clearCurrentChat: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial State
  chats: [],
  currentChat: null,
  messagesByChatId: {},
  isLoading: false,
  isRefreshing: false,
  error: null,
  chatsPagination: {
    page: 0,
    hasNext: true,
  },
  paginationByChatId: {},

  // Actions
  fetchChats: async (refresh = false) => {
    if (refresh) {
      set({ isRefreshing: true, error: null })
    } else {
      set({ isLoading: true, error: null })
    }

    try {
      const page = refresh ? 0 : get().chatsPagination.page
      const response = await getUserChatsApi(page)

      console.log('Successful fetch chats:', response)

      const newChats = response.data.chats
      set(state => ({
        chats: refresh ? newChats : [...state.chats, ...newChats],
        chatsPagination: {
          page: page + 1,
          hasNext: response.data.hasNext,
        },
        isLoading: false,
        isRefreshing: false,
      }))
    } catch (error) {
      console.error('Error fetching chats:', error)
      set({
        error: 'Failed to fetch chats',
        isLoading: false,
        isRefreshing: false,
      })
    }
  },

  fetchChatDetail: async (chatId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getChatDetailApi(chatId)
      console.log('Successful fetch chat detail:', response)
      set({ currentChat: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching chat detail:', error)
      set({ error: 'Failed to fetch chat detail', isLoading: false })
    }
  },

  createGetChat: async (recipientId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await createGetChatApi({ recipientId })
      console.log('Successful create/get chat:', response)

      const chat = response.data

      set(state => {
        const exists = state.chats.find(c => c.id === chat.id)
        if (exists) return { currentChat: chat, isLoading: false }
        return {
          chats: [chat, ...state.chats],
          currentChat: chat,
          isLoading: false,
        }
      })
    } catch (error) {
      console.error('Error creating/getting chat:', error)
      set({ error: 'Failed to start chat', isLoading: false })
      throw error
    }
  },

  deleteChat: async (chatId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await deleteChatApi(chatId)
      console.log('Successful delete chat:', response)

      set(state => {
        // Remove messages from cache to free memory
        const { [chatId]: _, ...restMessages } = state.messagesByChatId
        const { [chatId]: __, ...restPagination } = state.paginationByChatId

        return {
          chats: state.chats.filter(c => c.id !== chatId),
          currentChat:
            state.currentChat?.id === chatId ? null : state.currentChat,
          messagesByChatId: restMessages,
          paginationByChatId: restPagination,
          isLoading: false,
        }
      })
    } catch (error) {
      console.error('Error deleting chat:', error)
      set({ error: 'Failed to delete chat', isLoading: false })
      throw error
    }
  },

  fetchMessages: async (chatId: string, refresh = false) => {
    if (refresh) {
      set({ isRefreshing: true, error: null })
    } else {
      const hasMessages = (get().messagesByChatId[chatId] || []).length > 0
      if (!hasMessages) set({ isLoading: true, error: null })
    }

    try {
      const currentPagination = get().paginationByChatId[chatId] || {
        page: 0,
        hasNext: true,
      }
      const page = refresh ? 0 : currentPagination.page

      const response = await getMessagesApi(chatId, page)

      console.log('Successful fetch messages:', response)

      const newMessages = response.data.messages

      set(state => {
        const currentMessages = state.messagesByChatId[chatId] || []
        const updatedMessages = refresh
          ? newMessages
          : [...currentMessages, ...newMessages]

        return {
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: updatedMessages,
          },
          paginationByChatId: {
            ...state.paginationByChatId,
            [chatId]: {
              page: page + 1,
              hasNext: response.data.hasNext,
            },
          },
          isLoading: false,
          isRefreshing: false,
        }
      })
    } catch (error) {
      console.error('Error fetching messages:', error)
      set({
        error: 'Failed to fetch messages',
        isLoading: false,
        isRefreshing: false,
      })
    }
  },

  sendMessage: async (data, file) => {
    try {
      const response = await sendMessageApi(data, file)
      console.log('Successful send message:', response)

      set(state => {
        const currentMessages = state.messagesByChatId[data.chatId] || []

        return {
          messagesByChatId: {
            ...state.messagesByChatId,
            [data.chatId]: [response.data, ...currentMessages],
          },
          chats: state.chats.map(c =>
            c.id === data.chatId
              ? {
                  ...c,
                  lastMessage: response.data.content || 'Attachment',
                  lastMessageTime: response.data.createdAt,
                  lastMessageSenderId: response.data.senderId,
                }
              : c
          ),
          currentChat:
            state.currentChat?.id === data.chatId
              ? {
                  ...state.currentChat,
                  lastMessage: response.data.content || 'Attachment',
                  lastMessageTime: response.data.createdAt,
                  lastMessageSenderId: response.data.senderId,
                }
              : state.currentChat,
        }
      })
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const response = await deleteMessageApi(messageId)
      console.log('Successful delete message:', response)

      set(state => {
        const chatId = Object.keys(state.messagesByChatId).find(id =>
          state.messagesByChatId[id].some(m => m.id === messageId)
        )

        if (!chatId) return {}

        return {
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: state.messagesByChatId[chatId].map(m =>
              m.id === messageId
                ? { ...m, isDeleted: true, content: 'Message deleted' }
                : m
            ),
          },
        }
      })
    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  },

  markAsRead: async (chatId: string) => {
    try {
      const response = await markAsReadApi(chatId)
      console.log('Successful mark as read:', response)

      set(state => ({
        chats: state.chats.map(c =>
          c.id === chatId ? { ...c, unreadCount: 0 } : c
        ),
        currentChat:
          state.currentChat?.id === chatId
            ? { ...state.currentChat, unreadCount: 0 }
            : state.currentChat,
      }))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  },

  clearCurrentChat: () => {
    set({
      currentChat: null,
      error: null,
    })
  },
}))
