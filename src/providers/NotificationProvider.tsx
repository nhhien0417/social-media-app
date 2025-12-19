import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from 'react'
import * as Notifications from 'expo-notifications'
import { useStomp, useStompEvent } from '@/hooks/useRealTimeNotification'
import { Notification, NotificationType } from '@/types/Notification'
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  setBadgeCount,
} from '@/services/pushNotifications'
import { registerPushToken } from '@/api/api.notification'
import { useRouter, usePathname } from 'expo-router'
import { NotificationToast } from '@/features/notifications/components/NotificationToast'
import { getNotificationMessage } from '@/utils/NotificationMessage'

/**
 * Notification Context value interface
 */
interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  isConnected: boolean
  pushToken: string | null
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  handleNotificationPress: (notification: Notification) => void
}

/**
 * Notification Context
 */
const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
)

interface NotificationProviderProps {
  children: ReactNode
  userId: string | null
}

/**
 * Notification Provider Component
 * Manages real-time notifications via STOMP WebSocket
 * Receives notifications from backend via Kafka/WebSocket
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId: propUserId,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pushToken, setPushToken] = useState<string | null>(null)
  const notificationListener = useRef<Notifications.Subscription | null>(null)
  const responseListener = useRef<Notifications.Subscription | null>(null)
  const userId = propUserId
  const router = useRouter()
  const pathname = usePathname()
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null)

  // =====================================
  // SETUP PUSH NOTIFICATIONS
  // =====================================
  useEffect(() => {
    let isMounted = true

    // Register for Push Notifications
    const setupPushNotifications = async () => {
      try {
        // Get Push Token
        const token = await registerForPushNotificationsAsync()

        if (token && isMounted) {
          setPushToken(token)
          console.log('Push Token:', token)

          // Send token to backend
          if (userId) {
            try {
              await registerPushToken(token)
              console.log('Registered Push Token with backend')
            } catch (error) {
              console.error('Error registering Push Token:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error setting up Push Notifications:', error)
      }
    }
    setupPushNotifications()

    // Cleanup
    return () => {
      isMounted = false
    }
  }, [userId])

  // =====================================
  // LISTEN TO PUSH NOTIFICATIONS
  // =====================================
  useEffect(() => {
    notificationListener.current = addNotificationReceivedListener(
      notification => {
        console.log(
          'Push Notification received (app foreground):',
          notification
        )

        // Parse notification data
        const data = notification.request.content.data as Record<string, any>

        // Check if notification already exists (might have been received via WebSocket)
        const notificationId = data.notificationId || Date.now()

        setNotifications(prev => {
          // Avoid duplicates if already received via WebSocket
          const exists = prev.some(n => n.id === notificationId)
          if (exists) {
            console.log(
              'Notification already exists (from WebSocket), skipping...'
            )
            return prev
          }

          // Create NotificationItem from push notification
          const newNotification: Notification = {
            id: notificationId.toString(),
            senderId: (data.senderId as string) || '0',
            receiverId: userId || '',
            message: notification.request.content.body || '',
            createdAt: new Date().toISOString(),
            read: false,
            type: (data.type as NotificationType) || 'NEW_POST',
            extraData: data,
          }

          newNotification.message = getNotificationMessage(newNotification.type)
          return [newNotification, ...prev]
        })
      }
    )

    // Listen when user taps on notification
    responseListener.current = addNotificationResponseReceivedListener(
      response => {
        console.log('Notification tapped:', response)

        const data = response.notification.request.content.data as Record<
          string,
          any
        >

        console.log('Navigation data:', data)

        if (data.postId) {
          router.push(`/post/${data.postId}`)
        } else if (data.senderId) {
          router.push(`/profile/${data.senderId}`)
        }
      }
    )

    // Cleanup listeners
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove()
      }
      if (responseListener.current) {
        responseListener.current.remove()
      }
    }
  }, [])

  // =====================================
  // UPDATE BADGE COUNT
  // =====================================
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length
    setBadgeCount(unreadCount)
  }, [notifications])

  // Connect to STOMP WebSocket
  const { isConnected } = useStomp({
    userId: userId || undefined,
    autoConnect: !!userId && userId !== 'guest',
    autoDisconnect: true,
  })

  /**
   * Handle new notification received from Kafka/Backend via STOMP WebSocket
   * This is the main source when app is OPEN (real-time, prioritized over Push)
   */
  const handleNewNotification = useCallback(
    (notification: Notification) => {
      console.log('Notification received:', notification)

      if (
        notification.type === 'NEW_MESSAGE' &&
        pathname?.startsWith('/message')
      ) {
        setNotifications(prev => {
          if (prev.some(n => n.id === notification.id)) {
            return prev
          }
          const formattedNotification = {
            ...notification,
            message: getNotificationMessage(notification.type),
          }
          return [formattedNotification, ...prev]
        })
        return
      }

      setNotifications(prev => {
        if (prev.some(n => n.id === notification.id)) {
          return prev
        }

        const formattedNotification = {
          ...notification,
          message: getNotificationMessage(notification.type),
        }
        return [formattedNotification, ...prev]
      })

      // Show in-app toast
      setCurrentNotification({
        ...notification,
        message: getNotificationMessage(notification.type),
      })
    },
    [pathname]
  )

  // Listen to notification events from STOMP WebSocket
  useStompEvent<Notification>('notification', handleNewNotification)

  /**
   * Mark a single notification as read
   * Note: Backend needs to implement corresponding STOMP endpoint
   * @param id - Notification ID
   */
  const markAsRead = useCallback((id: string) => {
    // For now, just update UI optimistically
    // TODO: Send STOMP message to backend when endpoint is ready
    // stompService.send('/notifications/mark-read', { id })

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  /**
   * Mark all notifications as read
   * Note: Backend needs to implement corresponding STOMP endpoint
   */
  const markAllAsRead = useCallback(() => {
    // For now, just update UI optimistically
    // TODO: Send STOMP message to backend when endpoint is ready
    // stompService.send('/notifications/mark-all-read', {})

    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  /**
   * Delete a single notification
   * Note: Backend needs to implement corresponding STOMP endpoint
   * @param id - Notification ID
   */
  const deleteNotification = useCallback((id: string) => {
    // For now, just update UI optimistically
    // TODO: Send STOMP message to backend when endpoint is ready
    // stompService.send('/notifications/delete', { id })

    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  /**
   * Clear all notifications
   * Note: Backend needs to implement corresponding STOMP endpoint
   */
  const clearAll = useCallback(() => {
    // For now, just update UI optimistically
    // stompService.send('/notifications/clear-all', {})

    setNotifications([])
  }, [])

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length

  /**
   * Handle notification press
   */
  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Mark as read
      if (!notification.read) {
        markAsRead(notification.id)
      }

      // Close toast
      setCurrentNotification(null)

      // Navigate based on type
      const { type, extraData: data, senderId } = notification
      let targetPath: string | null = null

      switch (type) {
        case 'NEW_POST':
        case 'LIKE_POST':
        case 'COMMENT_ON_POST':
          if (data?.postId) {
            targetPath = `/post/${data.postId}`
          } else if (senderId) {
            targetPath = `/profile/${senderId}`
          }
          break

        case 'NEW_STORY':
        case 'LIKE_STORY':
        case 'COMMENT_ON_STORY':
          if (data?.storyId) {
            targetPath = `/story/${data.storyId}?mode=SINGLE`
          } else if (senderId) {
            targetPath = `/profile/${senderId}`
          }
          break

        case 'LIKE_COMMENT':
        case 'REPLY_COMMENT':
          if (data?.postId) {
            targetPath = `/post/${data.postId}`
          } else if (data?.storyId) {
            targetPath = `/story/${data.storyId}?mode=SINGLE`
          } else if (senderId) {
            targetPath = `/profile/${senderId}`
          }
          break

        case 'NEW_MESSAGE':
          if (data?.chatId) {
            targetPath = `/message/${data.chatId}`
          } else if (senderId) {
            targetPath = `/profile/${senderId}`
          }
          break

        case 'GROUP_JOIN_REQUEST':
        case 'GROUP_JOIN_ACCEPTED':
        case 'GROUP_ROLE_CHANGE':
        case 'GROUP_NEW_POST':
          if (data?.groupId) {
            targetPath = `/group/${data.groupId}`
          } else if (senderId) {
            targetPath = `/profile/${senderId}`
          }
          break

        case 'FRIEND_REQUEST':
        case 'FRIEND_REQUEST_ACCEPTED':
          if (senderId) {
            targetPath = `/profile/${senderId}`
          }
          break

        default:
          if (senderId) {
            targetPath = `/profile/${senderId}`
          }
          break
      }

      if (targetPath && pathname === targetPath) {
        const refreshPath = `${targetPath}?refresh=${Date.now()}`
        router.replace(refreshPath as any)
        return
      }

      if (targetPath) {
        router.push(targetPath as any)
      }
    },
    [markAsRead, pathname]
  )

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isConnected,
    pushToken,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    handleNotificationPress,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationToast
        key={currentNotification?.id}
        notification={currentNotification}
        onPress={handleNotificationPress}
        onDismiss={() => setCurrentNotification(null)}
      />
    </NotificationContext.Provider>
  )
}

/**
 * Hook to use notification context
 * @returns Notification context value
 * @throws Error if used outside NotificationProvider
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    )
  }
  return context
}
