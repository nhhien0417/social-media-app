import { Client, StompConfig, IFrame, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAccessToken } from '@/utils/SecureStore'
import { ChatMessageEvent } from '@/types/Chat'
import { CHAT_WEBSOCKET_URL } from '@/utils/BaseUrl'

/**
 * Chat STOMP Service - Singleton pattern
 * Manages WebSocket connection for chat realtime features
 */
class ChatStompService {
  private client: Client | null = null
  private connected: boolean = false
  private callbacks: Map<string, Set<Function>> = new Map()
  private currentUserId: string | null = null
  private subscriptions: any[] = []
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 10

  /**
   * Connect to Chat WebSocket server
   */
  async connect(userId: string): Promise<void> {
    // If already connected with same user, skip
    if (this.client?.active && this.currentUserId === userId) {
      console.log('[ChatWS] Already connected for user:', userId)
      return
    }

    // If connecting with different user, disconnect first
    if (this.client?.active && this.currentUserId !== userId) {
      console.log('[ChatWS] Disconnecting previous connection')
      this.disconnect()
    }

    this.currentUserId = userId
    const url = CHAT_WEBSOCKET_URL

    const token = await getAccessToken()
    if (!token) {
      console.error('[ChatWS] No access token available')
      return
    }

    const config: StompConfig = {
      webSocketFactory: () => new SockJS(url) as any,

      connectHeaders: {
        Authorization: `Bearer ${token}`,
        userId: userId,
      },

      // Auto reconnect configuration
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      // Debug logging
      debug: (msg: string) => {
        if (msg.includes('ERROR') || msg.includes('DISCONNECT')) {
          console.error('[ChatWS Debug]', msg)
        }
      },

      // Event handlers
      onConnect: (frame: IFrame) => {
        console.log('[ChatWS] Connected successfully')
        this.connected = true
        this.reconnectAttempts = 0
        this.subscribeToQueues()
        this.emit('connect', { userId })
      },

      onStompError: (frame: IFrame) => {
        console.error('[ChatWS] STOMP Error:', frame.headers['message'])
        console.error('[ChatWS] Error body:', frame.body)
        this.connected = false
        this.emit('error', {
          message: frame.headers['message'],
          body: frame.body,
        })
      },

      onWebSocketClose: (event: CloseEvent) => {
        console.log(
          '[ChatWS] WebSocket closed. Code:',
          event.code,
          'Reason:',
          event.reason
        )
        this.connected = false
        this.subscriptions = []
        this.emit('disconnect', { reason: event.reason, code: event.code })

        // Attempt to reconnect with fresh token
        this.handleReconnect()
      },

      onDisconnect: () => {
        console.log('[ChatWS] Disconnected')
        this.connected = false
        this.subscriptions = []
        this.emit('disconnect', {})
      },

      onWebSocketError: (event: any) => {
        console.error('[ChatWS] WebSocket error:', event)
      },
    }

    this.client = new Client(config)
    this.client.activate()
  }

  /**
   * Handle reconnection with fresh token
   */
  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[ChatWS] Max reconnect attempts reached')
      return
    }

    if (!this.currentUserId) return

    this.reconnectAttempts++
    console.log(
      `[ChatWS] Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`
    )

    // Wait a bit before reconnecting
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Get fresh token and reconnect
    const token = await getAccessToken()
    if (token && this.currentUserId) {
      // Update connect headers with fresh token
      if (this.client) {
        this.client.connectHeaders = {
          Authorization: `Bearer ${token}`,
          userId: this.currentUserId,
        }
      }
    }
  }

  /**
   * Subscribe to all chat queues
   */
  private subscribeToQueues(): void {
    if (!this.client?.active) return

    this.subscriptions.forEach(sub => {
      try {
        sub.unsubscribe()
      } catch (e) {}
    })
    this.subscriptions = []

    const msgSub = this.client.subscribe(
      '/user/queue/messages',
      (message: IMessage) => {
        try {
          const event: ChatMessageEvent = JSON.parse(message.body)

          const isOwnEvent = event.senderId === this.currentUserId

          if (event.eventType === 'NEW_MESSAGE' && !isOwnEvent) {
            console.log(
              `[RT RECEIVED] NEW_MESSAGE: ${event.content || '[attachment]'}`
            )
          } else if (event.eventType === 'MESSAGE_READ' && !isOwnEvent) {
            console.log(`[RT RECEIVED] MESSAGE_READ`)
          }

          this.emit('message', event)
        } catch (e) {
          console.error('[ChatWS] Failed to parse message:', e)
        }
      }
    )
    this.subscriptions.push(msgSub)

    const typingSub = this.client.subscribe(
      '/user/queue/typing',
      (message: IMessage) => {
        try {
          const event: ChatMessageEvent = JSON.parse(message.body)
          console.log(`[RT RECEIVED] ${event.content}`)
          this.emit('typing', event)
        } catch (e) {
          console.error('[ChatWS] Failed to parse typing:', e)
        }
      }
    )
    this.subscriptions.push(typingSub)

    const statusSub = this.client.subscribe(
      '/user/queue/online-status',
      (message: IMessage) => {
        try {
          const event: ChatMessageEvent = JSON.parse(message.body)
          console.log(`[RT RECEIVED] ${event.eventType}`)
          this.emit('online-status', event)
        } catch (e) {
          console.error('[ChatWS] Failed to parse online status:', e)
        }
      }
    )
    this.subscriptions.push(statusSub)
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatId: string, isTyping: boolean): void {
    if (!this.client?.active) {
      console.warn('[ChatWS] Cannot send typing: not connected')
      return
    }

    console.log(`[RT SEND] ${isTyping ? 'TYPING_START' : 'TYPING_STOP'}`)

    const request = { chatId, isTyping }
    this.client.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify(request),
    })
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.client?.active) {
      console.log('[ChatWS] Disconnecting...')

      // Unsubscribe from all queues
      this.subscriptions.forEach(sub => {
        try {
          sub.unsubscribe()
        } catch (e) {
          console.error('[ChatWS] Error unsubscribing:', e)
        }
      })
      this.subscriptions = []

      this.client.deactivate()
      this.connected = false
      this.currentUserId = null
      this.reconnectAttempts = 0
    }
  }

  async forceReconnect(): Promise<void> {
    const userId = this.currentUserId
    this.disconnect()
    if (userId) {
      await this.connect(userId)
    }
  }

  isConnected(): boolean {
    return this.connected && this.client?.active === true
  }

  getUserId(): string | null {
    return this.currentUserId
  }

  // Event emitter methods
  on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set())
    }
    this.callbacks.get(event)?.add(callback)
  }

  off(event: string, callback: Function): void {
    this.callbacks.get(event)?.delete(callback)
  }

  private emit(event: string, data: any): void {
    this.callbacks.get(event)?.forEach(cb => {
      try {
        cb(data)
      } catch (e) {
        console.error(`[ChatWS] Callback error:`, e)
      }
    })
  }
}

export const chatStompService = new ChatStompService()
export default chatStompService
