import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { formatPushTokenForBackend } from '@/services/pushNotifications'
import { NotificationType } from '@/types/Notification'

interface RegisterPushTokenRequest {
  token: string
  type: 'ios' | 'android'
  deviceId?: string
  deviceName?: string
}

type PushNotificationSettings = {
  enabled: boolean
} & Partial<Record<NotificationType, boolean>>

// --- API Functions ---

export const registerPushToken = async (
  token: string,
  deviceInfo?: { deviceId?: string; deviceName?: string }
): Promise<void> => {
  try {
    const formattedToken = formatPushTokenForBackend(token)

    const response = await apiClient.post(
      ENDPOINTS.NOTIFICATIONS.REGISTER_PUSH_TOKEN,
      {
        ...formattedToken,
        ...deviceInfo,
      }
    )

    console.log('Push Token registered successfully:', response.data)
  } catch (error) {
    console.error('Error registering Push Token:', error)
    throw error
  }
}

export const unregisterPushToken = async (token: string): Promise<void> => {
  try {
    await apiClient.post(ENDPOINTS.NOTIFICATIONS.UNREGISTER_PUSH_TOKEN, {
      token,
    })

    console.log('Push Token unregistered successfully')
  } catch (error) {
    console.error('Error unregistering Push Token:', error)
    throw error
  }
}

export const updatePushSettings = async (
  settings: Partial<PushNotificationSettings>
): Promise<void> => {
  try {
    const response = await apiClient.put(
      ENDPOINTS.NOTIFICATIONS.UPDATE_SETTINGS,
      settings
    )

    console.log('Push Notification settings updated:', response.data)
  } catch (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}

export const getPushSettings = async (): Promise<PushNotificationSettings> => {
  try {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.GET_SETTINGS)

    return response.data
  } catch (error) {
    console.error('Error getting settings:', error)
    throw error
  }
}

export type { RegisterPushTokenRequest, PushNotificationSettings }
