import { User } from './User'

export interface Chat {
  id: string
  unreadCount: number
  lastMessage: string
  lastMessageTime: string
  lastMessageSenderId: string
  otherParticipant: User
}
