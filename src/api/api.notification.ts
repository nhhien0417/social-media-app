import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { formatPushTokenForBackend } from '@/services/pushNotifications'

/**
 * Interface cho Push Token Request
 */
interface RegisterPushTokenRequest {
  token: string
  type: 'ios' | 'android'
  deviceId?: string
  deviceName?: string
}

/**
 * Interface cho Push Settings
 */
interface PushNotificationSettings {
  enabled: boolean
  likes: boolean
  comments: boolean
  follows: boolean
  messages: boolean
  mentions: boolean
}

/**
 * Đăng ký Push Token với backend
 * Backend sẽ lưu token này để gửi push notifications
 * @param token - Expo Push Token
 * @param deviceInfo - Thông tin thiết bị (optional)
 */
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

    console.log('Push Token đã được đăng ký thành công:', response.data)
  } catch (error) {
    console.error('Lỗi khi đăng ký Push Token:', error)
    throw error
  }
}

/**
 * Hủy đăng ký Push Token (khi logout hoặc tắt notifications)
 * @param token - Expo Push Token cần hủy
 */
export const unregisterPushToken = async (token: string): Promise<void> => {
  try {
    await apiClient.post(ENDPOINTS.NOTIFICATIONS.UNREGISTER_PUSH_TOKEN, {
      token,
    })

    console.log('Push Token đã được hủy đăng ký')
  } catch (error) {
    console.error('Lỗi khi hủy đăng ký Push Token:', error)
    throw error
  }
}

/**
 * Cập nhật cài đặt Push Notifications
 * @param settings - Cài đặt mới
 */
export const updatePushSettings = async (
  settings: Partial<PushNotificationSettings>
): Promise<void> => {
  try {
    const response = await apiClient.put(
      ENDPOINTS.NOTIFICATIONS.UPDATE_SETTINGS,
      settings
    )

    console.log('Cài đặt Push Notifications đã được cập nhật:', response.data)
  } catch (error) {
    console.error('Lỗi khi cập nhật cài đặt:', error)
    throw error
  }
}

/**
 * Lấy cài đặt Push Notifications hiện tại
 */
export const getPushSettings = async (): Promise<PushNotificationSettings> => {
  try {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS.GET_SETTINGS)

    return response.data
  } catch (error) {
    console.error('Lỗi khi lấy cài đặt:', error)
    throw error
  }
}

export type { RegisterPushTokenRequest, PushNotificationSettings }
