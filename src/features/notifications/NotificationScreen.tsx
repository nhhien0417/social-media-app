import { useEffect, useState, useCallback } from 'react'
import { YStack } from 'tamagui'
import { useNotificationStore } from '@/stores/notificationStore'
import { useNotifications } from '@/providers/NotificationProvider'
import type { Notification } from '@/types/Notification'
import NotificationHeader from './components/NotificationHeader'
import NotificationList from './components/NotificationList'
import GlobalActionsSheet from './components/GlobalActionsSheet'
import NotificationOptionsSheet from './components/NotificationOptionsSheet'

export default function NotificationScreen() {
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore()

  const { handleNotificationPress } = useNotifications()

  const [isGlobalSheetOpen, setIsGlobalSheetOpen] = useState(false)
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications(true)
  }, [fetchNotifications])

  const handleRefresh = useCallback(() => {
    fetchNotifications(true)
  }, [fetchNotifications])

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext && !isLoading) {
      fetchNotifications(false)
    }
  }, [fetchNotifications, pagination.hasNext, isLoading])

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead()
    setIsGlobalSheetOpen(false)
  }, [markAllAsRead])

  const handleMarkAsRead = useCallback(
    (id: string) => {
      markAsRead(id)
      setActiveNotification(null)
    },
    [markAsRead]
  )

  const handleDeleteNotification = useCallback(
    (id: string) => {
      deleteNotification(id)
      setActiveNotification(null)
    },
    [deleteNotification]
  )

  const handleNotificationItemPress = useCallback(
    (notification: Notification) => {
      // Mark as read if not already
      if (!notification.read) {
        markAsRead(notification.id)
      }
      handleNotificationPress(notification)
    },
    [markAsRead, handleNotificationPress]
  )

  return (
    <YStack flex={1} backgroundColor="$background">
      <NotificationHeader onMorePress={() => setIsGlobalSheetOpen(true)} />

      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        hasNext={pagination.hasNext}
        onNotificationPress={handleNotificationItemPress}
        onMorePress={setActiveNotification}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
      />

      <GlobalActionsSheet
        visible={isGlobalSheetOpen}
        onClose={() => setIsGlobalSheetOpen(false)}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllRead}
      />

      <NotificationOptionsSheet
        visible={!!activeNotification}
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
      />
    </YStack>
  )
}
