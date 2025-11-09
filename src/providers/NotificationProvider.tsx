import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { useStomp, useStompEvent } from '@/stomp/useStomp'
import { NotificationItem } from '@/types/Notification'

/**
 * Notification Context value interface
 */
interface NotificationContextValue {
  notifications: NotificationItem[]
  unreadCount: number
  isConnected: boolean
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

  // TODO: Get userId from auth token/context when available
  // For now, use prop or fallback to 'guest'
  const userId = propUserId || 'guest'

  // Connect to STOMP WebSocket
  const { isConnected } = useStomp({
    userId,
    autoConnect: !!userId && userId !== 'guest',
    autoDisconnect: true,
  })

  /**
   * Handle new notification received from Kafka/Backend via STOMP
   */
  const handleNewNotification = useCallback(
    (notification: NotificationItem) => {
      console.log('🔔 New notification:', notification)

      setNotifications(prev => {
        // Check for duplicates
        if (prev.some(n => n.id === notification.id)) {
          return prev
        }
        // Add new notification at the beginning
        return [notification, ...prev]
      })

      // Optional: Show toast notification
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
