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
import { NotificationItem, NotificationType } from '@/types/Notification'
import { notifications as mockNotifications } from '@/mock/notifications'
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  setBadgeCount,
} from '@/services/pushNotifications'
import { registerPushToken } from '@/api/api.notification'

/**
 * Notification Context value interface
 */
interface NotificationContextValue {
  notifications: NotificationItem[]
  unreadCount: number
  isConnected: boolean
  pushToken: string | null
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteNotification: (id: number) => void
  clearAll: () => void
}

/**
 * Notification Context
 */
const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
)

interface NotificationProviderProps {
  children: ReactNode
  /**
   * User ID for WebSocket connection (optional)
   * If not provided, will try to get from token or use 'guest'
   * Pass the logged-in user's ID here for proper notification routing
   */
  userId?: string
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [pushToken, setPushToken] = useState<string | null>(null)
  const notificationListener = useRef<Notifications.Subscription | null>(null)
  const responseListener = useRef<Notifications.Subscription | null>(null)

  // TODO: Get userId from auth token/context when available
  // For now, use prop or fallback to 'guest'
  const userId = propUserId || 'guest'

  // =====================================
  // SETUP PUSH NOTIFICATIONS
  // =====================================
  useEffect(() => {
    let isMounted = true

    // Đăng ký Push Notifications
    const setupPushNotifications = async () => {
      try {
        // Lấy Push Token
        const token = await registerForPushNotificationsAsync()

        if (token && isMounted) {
          setPushToken(token)
          console.log('🔔 Push Token:', token)

          // Gửi token lên backend (chỉ khi có userId thật)
          if (userId && userId !== 'guest') {
            try {
              await registerPushToken(token)
              console.log('Đã đăng ký Push Token với backend')
            } catch (error) {
              console.error('Lỗi khi đăng ký Push Token:', error)
            }
          }
        }
      } catch (error) {
        console.error('Lỗi setup Push Notifications:', error)
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
  // (Chỉ hoạt động khi app ở background/killed)
  // =====================================
  useEffect(() => {
    // Lắng nghe notification khi app đang mở
    // Note: Push notifications vẫn được nhận nhưng WebSocket sẽ xử lý
    notificationListener.current = addNotificationReceivedListener(
      notification => {
        console.log(
          '🔔 Push Notification received (app foreground):',
          notification
        )

        // Parse notification data
        const data = notification.request.content.data as Record<string, any>

        // Kiểm tra xem notification đã tồn tại chưa (có thể đã nhận qua WebSocket)
        const notificationId = data.notificationId || Date.now()

        setNotifications(prev => {
          // Tránh duplicate nếu đã nhận qua WebSocket
          const exists = prev.some(n => n.id === notificationId)
          if (exists) {
            console.log(
              '📝 Notification already exists (from WebSocket), skipping...'
            )
            return prev
          }

          // Tạo NotificationItem từ push notification
          const newNotification: NotificationItem = {
            id: notificationId,
            senderId: (data.senderId as string) || '0',
            section: (data.section as string) || 'other',
            avatar:
              (data.avatar as string) || 'https://via.placeholder.com/150',
            message: notification.request.content.body || '',
            time: new Date().toISOString(),
            unread: true,
            type: (data.type as NotificationType) || 'other',
          }

          console.log('➕ Adding notification from Push:', newNotification.id)
          return [newNotification, ...prev]
        })
      }
    )

    // Lắng nghe khi user nhấn vào notification
    responseListener.current = addNotificationResponseReceivedListener(
      response => {
        console.log('🔔 Notification tapped:', response)

        const data = response.notification.request.content.data as Record<
          string,
          any
        >

        // TODO: Navigate to appropriate screen based on notification type
        // Example:
        // if (data.postId) {
        //   router.push(`/post/${data.postId}`)
        // } else if (data.senderId) {
        //   router.push(`/profile/${data.senderId}`)
        // } else if (data.type === 'message') {
        //   router.push(`/message/${data.messageId}`)
        // }

        console.log('📱 Navigation data:', data)
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
    const unreadCount = notifications.filter(n => n.unread).length
    setBadgeCount(unreadCount)
  }, [notifications])

  // Load mock notifications on mount (for development)
  useEffect(() => {
    // Load mock data initially
    setNotifications(mockNotifications as NotificationItem[])
  }, [])

  // Connect to STOMP WebSocket
  const { isConnected } = useStomp({
    userId,
    autoConnect: !!userId && userId !== 'guest',
    autoDisconnect: true,
  })

  /**
   * Handle new notification received from Kafka/Backend via STOMP WebSocket
   * Đây là nguồn chính khi app đang MỞ (real-time, ưu tiên hơn Push)
   */
  const handleNewNotification = useCallback(
    (notification: NotificationItem) => {
      console.log('🌐 WebSocket notification received:', notification)

      setNotifications(prev => {
        // Check for duplicates
        if (prev.some(n => n.id === notification.id)) {
          console.log('📝 Notification already exists, skipping...')
          return prev
        }

        console.log('➕ Adding notification from WebSocket:', notification.id)
        // Add new notification at the beginning
        return [notification, ...prev]
      })

      // Optional: Show in-app toast/banner
      // showToast(notification.message)
    },
    []
  )

  // Listen to notification events from STOMP WebSocket
  useStompEvent<NotificationItem>('notification', handleNewNotification)

  /**
   * Mark a single notification as read
   * Note: Backend needs to implement corresponding STOMP endpoint
   * @param id - Notification ID
   */
  const markAsRead = useCallback((id: number) => {
    // For now, just update UI optimistically
    // TODO: Send STOMP message to backend when endpoint is ready
    // stompService.send('/notifications/mark-read', { id })

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
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

    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }, [])

  /**
   * Delete a single notification
   * Note: Backend needs to implement corresponding STOMP endpoint
   * @param id - Notification ID
   */
  const deleteNotification = useCallback((id: number) => {
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
    // TODO: Send STOMP message to backend when endpoint is ready
    // stompService.send('/notifications/clear-all', {})

    setNotifications([])
  }, [])

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.unread).length

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isConnected,
    pushToken,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
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
