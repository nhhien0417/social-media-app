import { useEffect, useState, useCallback, useRef } from 'react'
import { chatStompService } from '@/services/chatWebSocket'
import { ChatMessageEvent } from '@/types/Chat'

export interface UseChatWebSocketOptions {
  userId?: string
  autoConnect?: boolean
  autoDisconnect?: boolean
}

/**
 * Hook to manage chat WebSocket connection
 */
export const useChatWebSocket = (options: UseChatWebSocketOptions = {}) => {
  const { userId, autoConnect = true, autoDisconnect = true } = options
  const [isConnected, setIsConnected] = useState(false)
  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (!userId) {
      console.warn('[useChatWebSocket] No userId provided')
      return
    }
    chatStompService.connect(userId)
  }, [userId])

  const disconnect = useCallback(() => {
    chatStompService.disconnect()
  }, [])

  // Check connection status
  useEffect(() => {
    connectionCheckInterval.current = setInterval(() => {
      setIsConnected(chatStompService.isConnected())
    }, 1000)

    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current)
      }
    }
  }, [])

  // Handle connection events
  useEffect(() => {
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    chatStompService.on('connect', handleConnect)
    chatStompService.on('disconnect', handleDisconnect)

    return () => {
      chatStompService.off('connect', handleConnect)
      chatStompService.off('disconnect', handleDisconnect)
    }
  }, [])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && userId) {
      connect()
    }
    return () => {
      if (autoDisconnect) {
        disconnect()
      }
    }
  }, [autoConnect, autoDisconnect, userId, connect, disconnect])

  return { isConnected, connect, disconnect }
}

/**
 * Hook to listen to chat events
 */
export const useChatEvent = <T = ChatMessageEvent>(
  event:
    | 'message'
    | 'typing'
    | 'online-status'
    | 'connect'
    | 'disconnect'
    | 'error',
  callback: (data: T) => void
) => {
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Register event listener only once
  useEffect(() => {
    const handler = (data: T) => callbackRef.current(data)
    chatStompService.on(event, handler)

    // Cleanup on unmount
    return () => {
      chatStompService.off(event, handler)
    }
  }, [event]) // Only depend on event type, not deps
}

/**
 * Hook to send typing indicator with debounce
 */
export const useSendTyping = (chatId: string, debounceMs = 3000) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  const sendTyping = useCallback(() => {
    // Send typing start if not already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true
      chatStompService.sendTyping(chatId, true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to send typing stop
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
      chatStompService.sendTyping(chatId, false)
    }, debounceMs)
  }, [chatId, debounceMs])

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    if (isTypingRef.current) {
      isTypingRef.current = false
      chatStompService.sendTyping(chatId, false)
    }
  }, [chatId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return { sendTyping, stopTyping }
}

export const useChatStompService = () => chatStompService
