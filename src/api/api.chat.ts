import { ApiClient, ApiClientForm, GenericResponse } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Platform } from 'react-native'
import { dataURItoBlob } from '@/utils/MediaUtils'
import { Message } from '@/types/Message'
import { Chat } from '@/types/Chat'

// --- Requests ---

export type CreateGetChatRequest = {
  recipientId: string
}

export type SendMessageRequest = {
  chatId: string
  content?: string
}

// --- Responses ---

export type ChatResponse = GenericResponse<Chat>

export type MessageResponse = GenericResponse<Message>

export type PagedChatsResponse = GenericResponse<{
  chats: Chat[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}>

export type PagedMessagesResponse = GenericResponse<{
  messages: Message[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}>

// --- API Functions ---

export const createGetChatApi = (data: CreateGetChatRequest) => {
  return ApiClient.post<ChatResponse>(ENDPOINTS.CHAT.CHAT_CREATE_GET, data)
}

export const getUserChatsApi = (page = 0, size = 20) => {
  return ApiClient.get<PagedChatsResponse>(
    `${ENDPOINTS.CHAT.CHAT_ALL}?page=${page}&size=${size}`
  )
}

export const getChatDetailApi = (chatId: string) => {
  return ApiClient.get<ChatResponse>(ENDPOINTS.CHAT.CHAT_DETAIL(chatId))
}

export const deleteChatApi = (chatId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.CHAT.CHAT_DELETE(chatId))
}

export const markAsReadApi = (chatId: string) => {
  return ApiClient.put<string>(ENDPOINTS.CHAT.CHAT_SEEN(chatId))
}

export const sendMessageApi = async (
  data: SendMessageRequest,
  attachments?: { uri: string; name: string; type: string }[]
): Promise<MessageResponse> => {
  const formData = new FormData()
  formData.append('message', JSON.stringify(data))

  if (attachments && attachments.length > 0) {
    for (const attachment of attachments) {
      if (attachment.uri.startsWith('data:')) {
        const blob = dataURItoBlob(attachment.uri)
        formData.append('attachments', blob, attachment.name)
      } else if (Platform.OS === 'web') {
        const response = await fetch(attachment.uri)
        const blob = await response.blob()
        formData.append('attachments', blob, attachment.name)
      } else {
        formData.append('attachments', {
          uri: attachment.uri,
          name: attachment.name,
          type: attachment.type,
        } as any)
      }
    }
  }

  return ApiClientForm.upload<MessageResponse>(
    'POST',
    `/${ENDPOINTS.CHAT.MESSAGE_SEND}`,
    formData
  )
}

export const getMessagesApi = (chatId: string, page = 0, size = 50) => {
  return ApiClient.get<PagedMessagesResponse>(
    `${ENDPOINTS.CHAT.MESSAGE_GET(chatId)}?page=${page}&size=${size}`
  )
}

export const deleteMessageApi = (messageId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.CHAT.MESSAGE_DELETE(messageId))
}
