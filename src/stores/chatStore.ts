import { create } from 'zustand'
import { Chat } from '@/types/Chat'
import { Message } from '@/types/Message'
import { ChatMessageEvent } from '@/types/Chat'
import {
  getUserChatsApi,
  getChatDetailApi,
  createGetChatApi,
  deleteChatApi,
  sendMessageApi,
  getMessagesApi,
  deleteMessageApi,
  markAsReadApi,
  getOnlineFriendsApi,
} from '@/api/api.chat'
import { getUserId } from '@/utils/SecureStore'

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

  // Realtime State
  onlineUsers: Set<string>
  typingByChatId: Record<string, string[]>

  // Actions
  fetchChats: (refresh?: boolean) => Promise<void>
  fetchChatDetail: (chatId: string) => Promise<void>
  createGetChat: (recipientId: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>

  fetchMessages: (chatId: string, refresh?: boolean) => Promise<void>
  sendMessage: (
    data: { chatId: string; content?: string },
    files?: { uri: string; name: string; type: string }[]
  ) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  markAsRead: (chatId: string) => Promise<void>

  // Realtime Actions
  receiveNewMessage: (event: ChatMessageEvent) => void
  receiveMessageRead: (event: ChatMessageEvent) => void
  updateOnlineStatus: (userId: string, isOnline: boolean) => void
  setTypingStatus: (chatId: string, userId: string, isTyping: boolean) => void
  fetchOnlineFriends: () => Promise<void>

  clearCurrentChat: () => void

  // Reset
  reset: () => void
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
  onlineUsers: new Set<string>(),
  typingByChatId: {},

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

        const shouldAdd = !!chat.lastMessage

        return {
          chats: shouldAdd ? [chat, ...state.chats] : state.chats,
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

      const newMessages: Message[] = response.data.messages.map(
        (msg: Message) => ({
          ...msg,
          status: (msg.readBy && msg.readBy.length > 1
            ? 'seen'
            : 'sent') as Message['status'],
        })
      )

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

  sendMessage: async (data, attachments) => {
    const tempId = `temp-${Date.now()}`
    const userId = await getUserId()
    const tempMessage: Message = {
      id: tempId,
      chatId: data.chatId,
      senderId: userId || 'unknown',
      content: data.content,
      attachments: attachments?.map(a => a.uri) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'sending',
    }

    set(state => {
      const currentMessages = state.messagesByChatId[data.chatId] || []
      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [data.chatId]: [tempMessage, ...currentMessages],
        },
      }
    })

    try {
      console.log('[RT SEND] NEW_MESSAGE:', data.content || '[attachment]')
      const response = await sendMessageApi(data, attachments)
      console.log('Successful send message:', response)

      set(state => {
        const currentMessages = state.messagesByChatId[data.chatId] || []

        const withoutTemp = currentMessages.filter(m => m.id !== tempId)

        const actualMessageExists = withoutTemp.some(
          m => m.id === response.data.id
        )

        const updatedMessages = actualMessageExists
          ? withoutTemp
          : [{ ...response.data, status: 'sent' } as Message, ...withoutTemp]

        let newChats = state.chats
        const chatIndex = newChats.findIndex(c => c.id === data.chatId)

        const lastMsgText =
          response.data.content ||
          (response.data.attachments?.length ? 'Sent an attachment' : '')

        if (chatIndex > -1) {
          const updatedChat = {
            ...newChats[chatIndex],
            lastMessage: lastMsgText,
            lastMessageTime: response.data.createdAt,
            lastMessageSenderId: response.data.senderId,
          }
          newChats = [
            updatedChat,
            ...newChats.filter((_, i) => i !== chatIndex),
          ]
        } else if (state.currentChat && state.currentChat.id === data.chatId) {
          const newChat = {
            ...state.currentChat,
            lastMessage: lastMsgText,
            lastMessageTime: response.data.createdAt,
            lastMessageSenderId: response.data.senderId,
          }
          newChats = [newChat, ...newChats]
        }

        return {
          messagesByChatId: {
            ...state.messagesByChatId,
            [data.chatId]: updatedMessages,
          },
          chats: newChats,
          currentChat:
            state.currentChat?.id === data.chatId
              ? {
                  ...state.currentChat,
                  lastMessage: lastMsgText,
                  lastMessageTime: response.data.createdAt,
                  lastMessageSenderId: response.data.senderId,
                }
              : state.currentChat,
        }
      })
    } catch (error) {
      console.error('Error sending message:', error)
      set(state => ({
        messagesByChatId: {
          ...state.messagesByChatId,
          [data.chatId]: (state.messagesByChatId[data.chatId] || []).map(m =>
            m.id === tempId ? { ...m, status: 'error' } : m
          ),
        },
      }))
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
            [chatId]: state.messagesByChatId[chatId].filter(
              m => m.id !== messageId
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
      console.log('[RT SEND] MESSAGE_READ')
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

  // Realtime Actions
  receiveNewMessage: async event => {
    if (!event.chatId || !event.messageId) return

    const currentUserId = await getUserId()
    const newMessage: Message = {
      id: event.messageId,
      chatId: event.chatId,
      senderId: event.senderId || '',
      content: event.content,
      attachments: event.attachments,
      createdAt: event.createdAt || new Date().toISOString(),
      updatedAt: event.createdAt || new Date().toISOString(),
      status: 'sent',
    }

    set(state => {
      const existingMessages = state.messagesByChatId[event.chatId!] || []
      const isDuplicate = existingMessages.some(m => m.id === event.messageId)
      if (isDuplicate) return {}

      // Update messages
      const updatedMessages = [newMessage, ...existingMessages]

      // Update chat list
      const lastMsgText =
        event.content || (event.attachments?.length ? 'Sent an attachment' : '')
      const chatIndex = state.chats.findIndex(c => c.id === event.chatId)
      let updatedChats = state.chats

      if (chatIndex > -1) {
        const isOwnMessage = event.senderId === currentUserId
        const newUnreadCount = isOwnMessage
          ? state.chats[chatIndex].unreadCount
          : state.chats[chatIndex].unreadCount + 1

        const updatedChat = {
          ...state.chats[chatIndex],
          lastMessage: lastMsgText,
          lastMessageTime: event.createdAt || new Date().toISOString(),
          lastMessageSenderId: event.senderId || '',
          unreadCount: newUnreadCount,
        }
        updatedChats = [
          updatedChat,
          ...state.chats.filter((_, i) => i !== chatIndex),
        ]
      }

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [event.chatId!]: updatedMessages,
        },
        chats: updatedChats,
      }
    })
  },

  receiveMessageRead: event => {
    if (!event.chatId) return

    set(state => {
      const messages = state.messagesByChatId[event.chatId!] || []

      const updatedMessages = messages.map(m => ({
        ...m,
        status: 'seen' as const,
        readBy: event.readBy || m.readBy,
      }))

      const updatedChats = state.chats.map(chat =>
        chat.id === event.chatId ? { ...chat, unreadCount: 0 } : chat
      )

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [event.chatId!]: updatedMessages,
        },
        chats: updatedChats,
      }
    })
  },

  updateOnlineStatus: (userId, isOnline) => {
    set(state => {
      const newOnlineUsers = new Set(state.onlineUsers)
      if (isOnline) {
        newOnlineUsers.add(userId)
      } else {
        newOnlineUsers.delete(userId)
      }
      return { onlineUsers: newOnlineUsers }
    })
  },

  setTypingStatus: (chatId, userId, isTyping) => {
    set(state => {
      const current = state.typingByChatId[chatId] || []
      let updated: string[]

      if (isTyping) {
        updated = current.includes(userId) ? current : [...current, userId]
      } else {
        updated = current.filter(id => id !== userId)
      }

      return {
        typingByChatId: { ...state.typingByChatId, [chatId]: updated },
      }
    })
  },

  fetchOnlineFriends: async () => {
    try {
      const response = await getOnlineFriendsApi()
      const onlineUserIds = response.data || []
      console.log('Successful fetch online friends:', onlineUserIds)
      set({ onlineUsers: new Set(onlineUserIds) })
    } catch (error) {
      console.error('Error fetching online friends:', error)
    }
  },

  clearCurrentChat: () => {
    set({
      currentChat: null,
      error: null,
    })
  },

  // Reset all state
  reset: () => {
    set({
      chats: [],
      currentChat: null,
      messagesByChatId: {},
      isLoading: false,
      isRefreshing: false,
      error: null,
      chatsPagination: { page: 0, hasNext: true },
      paginationByChatId: {},
      onlineUsers: new Set<string>(),
      typingByChatId: {},
    })
  },
}))
