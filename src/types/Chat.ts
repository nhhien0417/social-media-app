import { User } from './User'

export type ChatEventType =
  | 'TYPING'
  | 'USER_ONLINE'
  | 'USER_OFFLINE'
  | 'NEW_MESSAGE'
  | 'MESSAGE_READ'

export interface Chat {
  id: string
  unreadCount: number
  lastMessage: string
  lastMessageTime: string
  lastMessageSenderId: string
  otherParticipant: User
}

export interface ChatMessageEvent {
  eventType: ChatEventType
  chatId?: string
  messageId?: string
  sender?: User
  recipientId?: string
  content?: string
  attachments?: string[]
  createdAt?: string
  readBy?: string[]
}
