import { create } from 'zustand'
import { Notification } from '@/types/Notification'
import {
  getNotificationsApi,
  getUnreadCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
  deleteNotificationApi,
} from '@/api/api.notification'
import { useProfileStore } from './profileStore'

interface NotificationState {
  // State
  notifications: Notification[]
  unreadCount: number

  // Loading States
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Pagination State
  pagination: {
    page: number
    hasNext: boolean
  }

  // Actions
  fetchNotifications: (refresh?: boolean) => Promise<void>
  fetchUnreadCount: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>

  // Realtime Actions
  receiveNotification: (notification: Notification) => void

  // Reset
  reset: () => void
}

const initialState = {
  notifications: [] as Notification[],
  unreadCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null as string | null,
  pagination: {
    page: 0,
    hasNext: true,
  },
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  fetchNotifications: async (refresh = false) => {
    const { isLoading, isRefreshing, pagination } = get()

    if (isLoading || isRefreshing) return
    if (!refresh && !pagination.hasNext) return

    if (refresh) {
      set({ isRefreshing: true, error: null })
    } else {
      set({ isLoading: true, error: null })
    }

    try {
      const page = refresh ? 0 : pagination.page
      const response = await getNotificationsApi(page, 15)

      console.log('Fetched notifications page:', page, response)

      const newNotifications = response.data.notifications

      // Batch fetch unique sender users
      const senderIds = [
        ...new Set(newNotifications.map(n => n.senderId).filter(Boolean)),
      ]
      if (senderIds.length > 0) {
        const { fetchUsersBatch } = useProfileStore.getState()
        await fetchUsersBatch(senderIds)
        console.log('Fetched sender users:', senderIds)
      }

      set(state => ({
        notifications: refresh
          ? newNotifications
          : [...state.notifications, ...newNotifications],
        pagination: {
          page: page + 1,
          hasNext: response.data.hasNext,
        },
        isLoading: false,
        isRefreshing: false,
      }))
    } catch (error) {
      console.error('Error fetching notifications:', error)
      set({
        error: 'Failed to fetch notifications',
        isLoading: false,
        isRefreshing: false,
      })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await getUnreadCountApi()
      console.log('Fetched unread count:', response.data)
      set({ unreadCount: response.data })
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  },

  markAsRead: async (notificationId: string) => {
    // Optimistic update
    const previousState = get().notifications
    const notification = previousState.find(n => n.id === notificationId)
    if (!notification || notification.read) return

    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))

    try {
      await markNotificationAsReadApi(notificationId)
      console.log('Marked notification as read:', notificationId)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Rollback on failure
      set(state => ({
        notifications: previousState,
        unreadCount: state.unreadCount + 1,
      }))
      throw error
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    const previousNotifications = get().notifications
    const previousUnreadCount = get().unreadCount

    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }))

    try {
      await markAllNotificationsAsReadApi()
      console.log('Marked all notifications as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      // Rollback on failure
      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      })
      throw error
    }
  },

  deleteNotification: async (notificationId: string) => {
    // Optimistic update
    const previousNotifications = get().notifications
    const notification = previousNotifications.find(
      n => n.id === notificationId
    )
    const wasUnread = notification && !notification.read

    set(state => ({
      notifications: state.notifications.filter(n => n.id !== notificationId),
      unreadCount: wasUnread
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    }))

    try {
      await deleteNotificationApi(notificationId)
      console.log('Deleted notification:', notificationId)
    } catch (error) {
      console.error('Error deleting notification:', error)
      // Rollback on failure
      set(state => ({
        notifications: previousNotifications,
        unreadCount: wasUnread ? state.unreadCount + 1 : state.unreadCount,
      }))
      throw error
    }
  },

  receiveNotification: (notification: Notification) => {
    set(state => {
      // Check for duplicates
      const exists = state.notifications.some(n => n.id === notification.id)
      if (exists) return {}

      // Fetch sender user
      if (notification.senderId) {
        const { fetchUser } = useProfileStore.getState()
        fetchUser(notification.senderId)
      }

      return {
        notifications: [notification, ...state.notifications],
        unreadCount: notification.read
          ? state.unreadCount
          : state.unreadCount + 1,
      }
    })
  },

  reset: () => {
    set(initialState)
  },
}))
