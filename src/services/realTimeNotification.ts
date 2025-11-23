import { Client, StompConfig, IFrame, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { Platform } from 'react-native'
import { getAccessToken } from '@/utils/SecureStore'

const getWebSocketURL = (): string => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'web') {
      return 'http://localhost:9101/ws'
    }
    return 'http://192.168.1.2:9101/ws'
  }

  // Production mode - Use Gateway route or direct connection
  return 'https://notifications.your-domain.com/ws'
}

/**
 * STOMP Service - Singleton pattern
 * Manages WebSocket connection using STOMP protocol over SockJS
 */
class StompService {
  private client: Client | null = null
  private connected: boolean = false
  private callbacks: Map<string, Set<Function>> = new Map()
  private currentUserId: string | null = null

  /**
   * Connect to WebSocket server with STOMP protocol
   */
  connect(userId: string): void {
    if (this.client?.active) {
      console.log('🔌 STOMP already connected')
      return
    }

    this.currentUserId = userId
    const url = getWebSocketURL()
    console.log('🔌 Connecting to STOMP WebSocket:', url)

    const config: StompConfig = {
      // Use SockJS for transport compatibility
      webSocketFactory: () => new SockJS(url) as any,

      // Connection headers with JWT authentication
      connectHeaders: {
        Authorization: `Bearer ${getAccessToken()}`,
        userId: userId,
      },

      // Auto reconnect configuration
      reconnectDelay: 5000, // 5 seconds
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // Event handlers
      onConnect: (frame: IFrame) => {
        console.log('STOMP Connected successfully')
        console.log('📋 Connection frame:', frame)
        this.connected = true

        // Subscribe to user-specific notification topic
        this.subscribeToNotifications(userId)

        // Emit connect event
        this.emit('connect', { userId })
      },

      onStompError: (frame: IFrame) => {
        console.error('STOMP Error:', frame.headers['message'])
        console.error('📋 Error details:', frame.body)
        this.connected = false

        // Emit error event
        this.emit('error', {
          message: frame.headers['message'],
          body: frame.body,
        })
      },

      onWebSocketClose: (event: CloseEvent) => {
        console.log('🔌 WebSocket connection closed')
        console.log('📋 Close event:', event)
        this.connected = false

        // Emit disconnect event
        this.emit('disconnect', { reason: event.reason, code: event.code })
      },

      onDisconnect: (frame: IFrame) => {
        console.log('🔌 STOMP Disconnected')
        this.connected = false

        // Emit disconnect event
        this.emit('disconnect', { frame })
      },

      // Debug logs (disable in production)
      debug: __DEV__
        ? (str: string) => {
            // Only log important messages, not all frames
            if (
              str.includes('ERROR') ||
              str.includes('CONNECTED') ||
              str.includes('DISCONNECT')
            ) {
              console.log('🐛 STOMP:', str)
            }
          }
        : undefined,
    }

    // Create and activate STOMP client
    this.client = new Client(config)
    this.client.activate()
  }

  /**
   * Subscribe to notification topic for specific user
   */
  private subscribeToNotifications(userId: string): void {
    if (!this.client?.active) {
      console.warn('⚠️ Cannot subscribe: STOMP not connected')
      return
    }

    // Subscribe to user's notification topic
    const topic = `/topic/notifications/${userId}`
    console.log('📬 Subscribing to:', topic)

    this.client.subscribe(topic, (message: IMessage) => {
      try {
        console.log('📨 Received notification:', message.body)
        const notification = JSON.parse(message.body)

        // Emit notification event to all listeners
        this.emit('notification', notification)
      } catch (error) {
        console.error('Failed to parse notification:', error)
      }
    })
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.client?.active) {
      console.log('🔌 Disconnecting STOMP client...')
      this.client.deactivate()
      this.connected = false
      this.currentUserId = null
    }
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.connected && this.client?.active === true
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.currentUserId
  }

  /**
   * Register event listener
   */
  on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set())
    }
    this.callbacks.get(event)?.add(callback)
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const callbacks = this.callbacks.get(event)
    if (callbacks) {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        this.callbacks.delete(event)
      }
    }
  }

  /**
   * Register one-time event listener
   */
  once(event: string, callback: Function): void {
    const onceWrapper = (...args: any[]) => {
      callback(...args)
      this.off(event, onceWrapper)
    }
    this.on(event, onceWrapper)
  }

  /**
   * Emit event to all registered listeners
   */
  private emit(event: string, data: any): void {
    const callbacks = this.callbacks.get(event)
    if (callbacks && callbacks.size > 0) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} callback:`, error)
        }
      })
    }
  }

  /**
   * Send message to server (optional - for future use)
   */
  send(destination: string, body: any, headers?: Record<string, string>): void {
    if (!this.client?.active) {
      console.warn('⚠️ Cannot send message: STOMP not connected')
      return
    }

    try {
      this.client.publish({
        destination: `/app${destination}`,
        body: JSON.stringify(body),
        headers: headers || {},
      })
      console.log('📤 Message sent to:', destination)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  /**
   * Get STOMP client instance (for advanced usage)
   */
  getClient(): Client | null {
    return this.client
  }
}

// Export singleton instance
export const stompService = new StompService()
export default stompService
