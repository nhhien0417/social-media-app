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
import { registerPushTokenApi } from '@/api/api.notification'
import { useRouter, usePathname } from 'expo-router'
import { NotificationToast } from '@/features/notifications/components/NotificationToast'
import { useNotificationStore } from '@/stores/notificationStore'

/**
 * Notification Context value interface
 */
interface NotificationContextValue {
  isConnected: boolean
  pushToken: string | null
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
 * Syncs with notificationStore for state management
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId: propUserId,
}) => {
  const [pushToken, setPushToken] = useState<string | null>(null)
  const notificationListener = useRef<Notifications.Subscription | null>(null)
  const responseListener = useRef<Notifications.Subscription | null>(null)
  const userId = propUserId
  const router = useRouter()
  const pathname = usePathname()
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null)

  // Get store actions
  const {
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    receiveNotification,
  } = useNotificationStore()

  // =====================================
  // INITIAL DATA FETCH
  // =====================================
  useEffect(() => {
    if (userId) {
      fetchNotifications(true)
      fetchUnreadCount()
    }
  }, [userId, fetchNotifications, fetchUnreadCount])

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
              await registerPushTokenApi({ token, type: 'expo' })
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
        const notificationId = data.notificationId || `push-${Date.now()}`

        const newNotification: Notification = {
          id: notificationId.toString(),
          senderId: (data.senderId as string) || '0',
          receiverId: userId || '',
          createdAt: new Date().toISOString(),
          read: false,
          type: data.type as NotificationType,
          extraData: data,
        }

        // Add to store
        receiveNotification(newNotification)
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
        } else if (data.storyId) {
          router.push(`/story/${data.storyId}?mode=SINGLE`)
        } else if (data.chatId) {
          router.push(`/message/${data.chatId}`)
        } else if (data.groupId) {
          router.push(`/group/${data.groupId}`)
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
  }, [userId, receiveNotification, router])

  // =====================================
  // UPDATE BADGE COUNT
  // =====================================
  useEffect(() => {
    setBadgeCount(unreadCount)
  }, [unreadCount])

  // Connect to STOMP WebSocket
  const { isConnected } = useStomp({
    userId: userId || undefined,
    autoConnect: !!userId && userId !== 'guest',
    autoDisconnect: true,
  })

  /**
   * Handle new notification from STOMP WebSocket
   */
  const handleNewNotification = useCallback(
    (notification: Notification) => {
      console.log('WebSocket notification received:', notification)

      // Skip toast for NEW_MESSAGE if on message screen
      if (
        notification.type === 'NEW_MESSAGE' &&
        pathname?.startsWith('/message')
      ) {
        receiveNotification(notification)
        return
      }

      // Add to store
      receiveNotification(notification)

      // Show in-app toast
      setCurrentNotification(notification)
    },
    [pathname, receiveNotification]
  )

  // Listen to notification events from STOMP WebSocket
  useStompEvent<Notification>('notification', handleNewNotification)

  /**
   * Handle notification press - navigate based on type
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
    [markAsRead, pathname, router]
  )

  const value: NotificationContextValue = {
    isConnected,
    pushToken,
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
