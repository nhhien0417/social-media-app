import { ApiClient, GenericResponse } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Notification, NotificationType } from '@/types/Notification'

// --- Requests ---

export interface RegisterPushTokenRequest {
  token: string
  type?: 'ios' | 'android' | 'expo'
  deviceId?: string
  deviceName?: string
}

export interface UnregisterPushTokenRequest {
  token: string
}

export interface UpdateNotificationSettingsRequest {
  enabled?: boolean
  settings?: Partial<Record<NotificationType, boolean>>
}

// --- Responses ---

export type NotificationsResponse = GenericResponse<{
  notifications: Notification[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}>

export type UnreadCountResponse = GenericResponse<number>

export type NotificationSettingsResponse = GenericResponse<{
  id: string
  userId: string
  enabled: boolean
  settings: Partial<Record<NotificationType, boolean>>
  createdAt: string
  updatedAt: string
}>

// --- API Functions ---

export const getNotificationsApi = (page = 0, size = 20) => {
  return ApiClient.get<NotificationsResponse>(
    `${ENDPOINTS.NOTIFICATIONS.ALL}?page=${page}&size=${size}`
  )
}

export const markAllNotificationsAsReadApi = () => {
  return ApiClient.put<string>(ENDPOINTS.NOTIFICATIONS.ALL_READ)
}

export const getUnreadCountApi = () => {
  return ApiClient.get<UnreadCountResponse>(ENDPOINTS.NOTIFICATIONS.UNREAD)
}

export const markNotificationAsReadApi = (notificationId: string) => {
  return ApiClient.put<string>(ENDPOINTS.NOTIFICATIONS.READ(notificationId))
}

export const deleteNotificationApi = (notificationId: string) => {
  return ApiClient.delete<string>(
    ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)
  )
}

export const registerPushTokenApi = (data: RegisterPushTokenRequest) => {
  return ApiClient.post<GenericResponse<void>>(
    ENDPOINTS.NOTIFICATIONS.REGISTER_PUSH_TOKEN,
    data
  )
}

export const unregisterPushTokenApi = (data: UnregisterPushTokenRequest) => {
  return ApiClient.post<GenericResponse<void>>(
    ENDPOINTS.NOTIFICATIONS.UNREGISTER_PUSH_TOKEN,
    data
  )
}

export const getNotificationSettingsApi = () => {
  return ApiClient.get<NotificationSettingsResponse>(
    ENDPOINTS.NOTIFICATIONS.GET_SETTINGS
  )
}

export const updateNotificationSettingsApi = (
  data: UpdateNotificationSettingsRequest
) => {
  return ApiClient.put<GenericResponse<void>>(
    ENDPOINTS.NOTIFICATIONS.UPDATE_SETTINGS,
    data
  )
}
