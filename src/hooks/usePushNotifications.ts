import { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import {
  sendLocalNotification,
  scheduleNotification,
  cancelScheduledNotification,
  cancelAllScheduledNotifications,
  dismissAllNotifications,
  setBadgeCount,
  getBadgeCount,
} from '@/services/pushNotifications'
import { useNotifications } from '@/providers/NotificationProvider'

export function usePushNotifications() {
  const { pushToken, notifications, unreadCount } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)

  const sendTestNotification = async (
    title: string = 'Test Notification',
    body: string = 'This is a test notification',
    data?: Record<string, any>
  ) => {
    setIsLoading(true)
    try {
      await sendLocalNotification(title, body, data)
      return { success: true }
    } catch (error) {
      console.error('Error sending test notification:', error)
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  const scheduleNotificationLater = async (
    title: string,
    body: string,
    seconds: number,
    data?: Record<string, any>
  ) => {
    setIsLoading(true)
    try {
      const id = await scheduleNotification(title, body, seconds, data)
      return { success: true, notificationId: id }
    } catch (error) {
      console.error('Error scheduling notification:', error)
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  const cancelNotification = async (notificationId: string) => {
    try {
      await cancelScheduledNotification(notificationId)
      return { success: true }
    } catch (error) {
      console.error('Error canceling notification:', error)
      return { success: false, error }
    }
  }

  const cancelAllNotifications = async () => {
    try {
      await cancelAllScheduledNotifications()
      return { success: true }
    } catch (error) {
      console.error('Error canceling all notifications:', error)
      return { success: false, error }
    }
  }

  const clearAllNotifications = async () => {
    try {
      await dismissAllNotifications()
      return { success: true }
    } catch (error) {
      console.error('Error clearing notifications:', error)
      return { success: false, error }
    }
  }

  const updateBadgeCount = async (count: number) => {
    try {
      await setBadgeCount(count)
      return { success: true }
    } catch (error) {
      console.error('Error updating badge count:', error)
      return { success: false, error }
    }
  }

  const getCurrentBadgeCount = async () => {
    try {
      const count = await getBadgeCount()
      return { success: true, count }
    } catch (error) {
      console.error('Error getting badge count:', error)
      return { success: false, error }
    }
  }

  const clearBadgeCount = async () => {
    return updateBadgeCount(0)
  }

  return {
    pushToken,
    isLoading,
    notifications,
    unreadCount,

    sendTestNotification,
    scheduleNotificationLater,
    cancelNotification,
    cancelAllNotifications,
    clearAllNotifications,
    updateBadgeCount,
    getCurrentBadgeCount,
    clearBadgeCount,
  }
}

export function useNotificationListener(
  onReceived?: (notification: Notifications.Notification) => void,
  onTapped?: (response: Notifications.NotificationResponse) => void
) {
  useEffect(() => {
    let receivedSubscription: Notifications.Subscription
    let responseSubscription: Notifications.Subscription

    if (onReceived) {
      receivedSubscription =
        Notifications.addNotificationReceivedListener(onReceived)
    }

    if (onTapped) {
      responseSubscription =
        Notifications.addNotificationResponseReceivedListener(onTapped)
    }

    return () => {
      if (receivedSubscription) {
        receivedSubscription.remove()
      }
      if (responseSubscription) {
        responseSubscription.remove()
      }
    }
  }, [onReceived, onTapped])
}

export function useLastNotificationResponse() {
  const [lastResponse, setLastResponse] =
    useState<Notifications.NotificationResponse | null>(null)

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then(response => {
      setLastResponse(response)
    })
  }, [])

  return lastResponse
}
