import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import Constants from 'expo-constants'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
})

export interface PushTokenResponse {
  token: string
  type: 'ios' | 'android'
}

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token: string | null = null

  if (!Device.isDevice) {
    console.warn('Push Notifications only work on physical devices')
    return null
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.warn('Push Notification permission not granted')
      return null
    }

    // Check if running in Expo Go
    if (Constants.appOwnership === 'expo') {
      console.warn(
        'Push Notifications are not supported in Expo Go (SDK 53+). Please use a development build.'
      )
      return null
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId

    if (!projectId) {
      console.warn('Project ID not found. Please configure it in app.json')
      // Return null to avoid crash if projectId is missing
      return null
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data

    console.log('📱 Expo Push Token:', token)

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
    console.error('Error registering for Push Notifications:', error)
    return null
  }
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback)
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback)
}

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
    trigger: null,
  })
}

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

export async function cancelScheduledNotification(
  notificationId: string
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId)
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

export async function dismissAllNotifications(): Promise<void> {
  await Notifications.dismissAllNotificationsAsync()
}

export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync()
}

export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count)
}

export async function checkNotificationPermissions(): Promise<string> {
  const { status } = await Notifications.getPermissionsAsync()
  return status
}

export function formatPushTokenForBackend(token: string): PushTokenResponse {
  return {
    token,
    type: Platform.OS === 'ios' ? 'ios' : 'android',
  }
}
