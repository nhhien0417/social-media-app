export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content?: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
  readBy?: string[]
  status?: 'sending' | 'sent' | 'seen' | 'error'
}
