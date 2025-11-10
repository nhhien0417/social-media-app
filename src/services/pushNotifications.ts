/**
 * Push Notifications Service
 * Quản lý Push Notifications cho iOS và Android
 * Xử lý việc đăng ký, nhận và hiển thị thông báo đẩy
 */

import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import Constants from 'expo-constants'

/**
 * Cấu hình cách thông báo được hiển thị khi app đang mở
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Hiển thị alert/banner
    shouldPlaySound: true, // Phát âm thanh
    shouldSetBadge: true, // Hiển thị badge trên icon
    shouldShowBanner: true, // Hiển thị banner trên đầu màn hình
    shouldShowList: true, // Hiển thị trong danh sách notification
  }),
})

/**
 * Interface cho Push Token Response
 */
export interface PushTokenResponse {
  token: string
  type: 'ios' | 'android'
}

/**
 * Đăng ký nhận Push Notifications và lấy Expo Push Token
 * @returns Push Token hoặc null nếu thất bại
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token: string | null = null

  // Chỉ hoạt động trên thiết bị thật, không hoạt động trên emulator/simulator
  if (!Device.isDevice) {
    console.warn('Push Notifications chỉ hoạt động trên thiết bị thật')
    return null
  }

  try {
    // Kiểm tra quyền hiện tại
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    // Nếu chưa có quyền, yêu cầu quyền
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    // Nếu không được cấp quyền
    if (finalStatus !== 'granted') {
      console.warn('Không được cấp quyền Push Notifications')
      return null
    }

    // Lấy Expo Push Token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId

    if (!projectId) {
      console.warn(
        'Không tìm thấy Project ID. Vui lòng cấu hình trong app.json'
      )
      // Fallback: sử dụng token mặc định cho development
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: 'your-project-id-here', // TODO: Thay bằng project ID thực
        })
      ).data
    } else {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
    }

    console.log('📱 Expo Push Token:', token)

    // Cấu hình cho Android (tạo notification channel)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
        showBadge: true,
      })
    }

    return token
  } catch (error) {
    console.error('Lỗi khi đăng ký Push Notifications:', error)
    return null
  }
}

/**
 * Lắng nghe sự kiện nhận được notification khi app đang mở
 * @param callback - Hàm callback xử lý notification
 * @returns Subscription để có thể unsubscribe
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback)
}

/**
 * Lắng nghe sự kiện người dùng tương tác với notification
 * (nhấn vào notification)
 * @param callback - Hàm callback xử lý response
 * @returns Subscription để có thể unsubscribe
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback)
}

/**
 * Gửi local notification (thông báo local, không qua server)
 * Hữu ích cho testing
 * @param title - Tiêu đề notification
 * @param body - Nội dung notification
 * @param data - Dữ liệu bổ sung
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Gửi ngay lập tức
  })
}

/**
 * Lên lịch notification cho tương lai
 * @param title - Tiêu đề notification
 * @param body - Nội dung notification
 * @param seconds - Số giây sau khi gửi
 * @param data - Dữ liệu bổ sung
 */
export async function scheduleNotification(
  title: string,
  body: string,
  seconds: number,
  data?: Record<string, any>
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    },
  })
}

/**
 * Hủy một notification đã lên lịch
 * @param notificationId - ID của notification cần hủy
 */
export async function cancelScheduledNotification(
  notificationId: string
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId)
}

/**
 * Hủy tất cả notifications đã lên lịch
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

/**
 * Xóa tất cả notifications đang hiển thị
 */
export async function dismissAllNotifications(): Promise<void> {
  await Notifications.dismissAllNotificationsAsync()
}

/**
 * Lấy số badge hiện tại
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync()
}

/**
 * Set số badge (số hiển thị trên icon app)
 * @param count - Số badge
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count)
}

/**
 * Kiểm tra quyền Push Notifications
 */
export async function checkNotificationPermissions(): Promise<string> {
  const { status } = await Notifications.getPermissionsAsync()
  return status
}

/**
 * Format notification data để gửi lên backend
 * @param token - Expo Push Token
 */
export function formatPushTokenForBackend(token: string): PushTokenResponse {
  return {
    token,
    type: Platform.OS === 'ios' ? 'ios' : 'android',
  }
}
