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
    autoDisconnect: true,
  })

  const { receiveNewMessage, updateOnlineStatus } = useChatStore()

  // Listen for new messages globally
  useChatEvent<ChatMessageEvent>(
    'message',
    useCallback(
      event => {
        if (event.eventType === 'NEW_MESSAGE') {
          console.log('[ChatProvider] Received new message:', event.content)
          receiveNewMessage(event)
        }
      },
      [receiveNewMessage]
    )
  )

  // Listen for online status changes globally
  useChatEvent<ChatMessageEvent>(
    'online-status',
    useCallback(
      event => {
        if (event.sender?.id) {
          const isOnline = event.eventType === 'USER_ONLINE'
          console.log(
            `[ChatProvider] User ${event.sender.username} is ${isOnline ? 'online' : 'offline'}`
          )
          updateOnlineStatus(event.sender.id, isOnline)
        }
      },
      [updateOnlineStatus]
    )
  )

  // Log connection status changes
  useEffect(() => {
    console.log('[ChatProvider] Connection status changed:', isConnected)
  }, [isConnected])

  return (
    <ChatContext.Provider value={{ isConnected }}>
      {children}
    </ChatContext.Provider>
  )
}
