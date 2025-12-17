import { Client, StompConfig, IFrame, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { Platform } from 'react-native'
import { getAccessToken } from '@/utils/SecureStore'
import { ChatMessageEvent } from '@/types/Chat'

const getChatWebSocketURL = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:9086/chat/ws'
    }
    return 'http://192.168.1.4:9086/chat/ws'
  }
  return 'https://chat.your-domain.com/chat/ws'
}

/**
 * Chat STOMP Service - Singleton pattern
 * Manages WebSocket connection for chat realtime features
 */
class ChatStompService {
  private client: Client | null = null
  private connected: boolean = false
  private callbacks: Map<string, Set<Function>> = new Map()
  private currentUserId: string | null = null

  /**
   * Connect to Chat WebSocket server
   */
  async connect(userId: string): Promise<void> {
    if (this.client?.active) {
      console.log('[ChatWS] Already connected')
      return
    }

    this.currentUserId = userId
    const url = getChatWebSocketURL()

    // Get JWT token (must await!)
    const token = await getAccessToken()

    const config: StompConfig = {
      webSocketFactory: () => new SockJS(url) as any,

      connectHeaders: {
        Authorization: `Bearer ${token}`,
        userId: userId,
      },

      // Auto reconnect configuration
      reconnectDelay: 5000, // 5 seconds
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // Event handlers
      onConnect: (frame: IFrame) => {
        console.log('[ChatWS] Connected')
        console.log('Connection frame:', frame)
        this.connected = true
        this.subscribeToQueues()
        this.emit('connect', { userId })
      },

      onStompError: (frame: IFrame) => {
        console.error('[ChatWS] Error:', frame.headers['message'])
        this.connected = false
        this.emit('error', {
          message: frame.headers['message'],
          body: frame.body,
        })
      },

      onWebSocketClose: (event: CloseEvent) => {
        console.log('[ChatWS] Disconnected')
        this.connected = false
        this.emit('disconnect', { reason: event.reason, code: event.code })
      },

      onDisconnect: () => {
        this.connected = false
        this.emit('disconnect', {})
      },
    }

    this.client = new Client(config)
    this.client.activate()
  }

  /**
   * Subscribe to all chat queues
   */
  private subscribeToQueues(): void {
    if (!this.client?.active) return

    // Messages queue
    this.client.subscribe('/user/queue/messages', (message: IMessage) => {
      try {
        const event: ChatMessageEvent = JSON.parse(message.body)
        console.log('[ChatWS] ', event.eventType)
        this.emit('message', event)
      } catch (e) {
        console.error('[ChatWS] Failed to parse message:', e)
      }
    })

    // Typing queue
    this.client.subscribe('/user/queue/typing', (message: IMessage) => {
      try {
        const event: ChatMessageEvent = JSON.parse(message.body)
        console.log('[ChatWS] ', event.eventType, event.sender?.username)
        this.emit('typing', event)
      } catch (e) {
        console.error('[ChatWS] Failed to parse typing:', e)
      }
    })

    // Online status queue
    this.client.subscribe('/user/queue/online-status', (message: IMessage) => {
      try {
        const event: ChatMessageEvent = JSON.parse(message.body)
        console.log('[ChatWS] ', event.eventType, event.sender?.username)
        this.emit('online-status', event)
      } catch (e) {
        console.error('[ChatWS] Failed to parse online status:', e)
      }
    })
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatId: string, isTyping: boolean): void {
    if (!this.client?.active) {
      console.warn('[ChatWS] Cannot send typing: not connected')
      return
    }

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
      this.client.deactivate()
      this.connected = false
      this.currentUserId = null
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
