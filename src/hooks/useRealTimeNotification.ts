import { useEffect, useState, useCallback, useRef } from 'react'
import { stompService } from '@/services/realTimeNotification'

export interface UseStompOptions {
  /**
   * User ID for WebSocket connection
   */
  userId?: string
  /**
   * Auto-connect on mount (default: true)
   */
  autoConnect?: boolean
  /**
   * Auto-disconnect on unmount (default: true)
   */
  autoDisconnect?: boolean
}

/**
 * React hook to manage STOMP WebSocket connection
 * Handles connection lifecycle and provides connection status
 */
export const useStomp = (options: UseStompOptions = {}) => {
  const { userId, autoConnect = true, autoDisconnect = true } = options
  const [isConnected, setIsConnected] = useState(false)
  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null)

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!userId) {
      console.warn('⚠️ Cannot connect: userId is required')
      return
    }
    stompService.connect(userId)
  }, [userId])

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    stompService.disconnect()
  }, [])

  // Check connection status periodically
  useEffect(() => {
    connectionCheckInterval.current = setInterval(() => {
      setIsConnected(stompService.isConnected())
    }, 1000)

    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current)
      }
    }
  }, [])

  // Handle connection events
  useEffect(() => {
    const handleConnect = () => {
      console.log('🎉 STOMP connected')
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log('👋 STOMP disconnected')
      setIsConnected(false)
    }

    const handleError = (error: any) => {
      console.error('STOMP error:', error)
    }

    stompService.on('connect', handleConnect)
    stompService.on('disconnect', handleDisconnect)
    stompService.on('error', handleError)

    return () => {
      stompService.off('connect', handleConnect)
      stompService.off('disconnect', handleDisconnect)
      stompService.off('error', handleError)
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

  return {
    isConnected,
    connect,
    disconnect,
    userId: stompService.getUserId(),
  }
}

/**
 * React hook to listen to specific STOMP event
 * Automatically registers and unregisters event listener
 */
export const useStompEvent = <T = any>(
  event: string,
  callback: (data: T) => void,
  deps: any[] = []
) => {
  // Use ref to store callback to avoid re-registering on every render
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const eventHandler = (data: T) => {
      callbackRef.current(data)
    }

    stompService.on(event, eventHandler)

    return () => {
      stompService.off(event, eventHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps])
}

/**
 * React hook to send messages via STOMP
 * Returns a memoized send function
 */
export const useStompSend = () => {
  const send = useCallback(
    (destination: string, body: any, headers?: Record<string, string>) => {
      stompService.send(destination, body, headers)
    },
    []
  )

  return { send }
}

/**
 * React hook to get STOMP service instance
 * For advanced usage only
 */
export const useStompService = () => {
  return stompService
}
