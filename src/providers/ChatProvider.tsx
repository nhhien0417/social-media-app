import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useChatWebSocket, useChatEvent } from '@/hooks/useChatWebSocket'
import { useChatStore } from '@/stores/chatStore'
import { ChatMessageEvent } from '@/types/Chat'

interface ChatContextValue {
  isConnected: boolean
}

const ChatContext = createContext<ChatContextValue>({
  isConnected: false,
})

export const useChatConnection = () => useContext(ChatContext)

interface ChatProviderProps {
  userId: string | null
  children: React.ReactNode
}

/**
 * ChatProvider - Manages global WebSocket connection for chat
 * Ensures real-time messaging works regardless of navigation path
 */
export function ChatProvider({ userId, children }: ChatProviderProps) {
  const { isConnected } = useChatWebSocket({
    userId: userId || undefined,
    autoConnect: true,
    autoDisconnect: false,
  })

  const { receiveNewMessage, updateOnlineStatus } = useChatStore()

  // Listen for new messages globally
  useChatEvent<ChatMessageEvent>('message', event => {
    if (event.eventType === 'NEW_MESSAGE') {
      receiveNewMessage(event)
    }
  })

  // Listen for online status changes globally
  useChatEvent<ChatMessageEvent>('online-status', event => {
    if (event.senderId) {
      const isOnline = event.eventType === 'USER_ONLINE'
      updateOnlineStatus(event.senderId, isOnline)
    }
  })

  // Monitor connection status
  useEffect(() => {
    if (!isConnected) {
      console.warn('[ChatProvider] Connection lost - waiting for reconnect')
    }
  }, [isConnected])

  return (
    <ChatContext.Provider value={{ isConnected }}>
      {children}
    </ChatContext.Provider>
  )
}
