export enum MessageType {
  TEXT,
  IMAGE,
  VIDEO,
  AUDIO,
  FILE,
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  type: MessageType
  content: string
  fileUrl: string
  createdAt: string
  updatedAt: string
}
