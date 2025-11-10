import { useState, useEffect } from 'react'
import { YStack } from 'tamagui'
import { useNotifications } from '@/providers/NotificationProvider'
import type { NotificationItem } from '@/types/Notification'
import NotificationHeader from './components/NotificationHeader'
import NotificationList from './components/NotificationList'
import GlobalActionsSheet from './components/GlobalActionsSheet'
import NotificationSheet from './components/NotificationSheet'

/**
 * Notification Screen Component
 * Displays real-time notifications with actions
 */
export default function NotificationScreen() {
  // Get notification data and actions from context
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)
  const [layoutHeight, setLayoutHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  // Active notification for individual action sheet
  const [activeNotification, setActiveNotification] =
    useState<NotificationItem | null>(null)

  /**
   * Mark all notifications as read
   */
  const handleMarkAllRead = () => {
    markAllAsRead()
    setIsSheetOpen(false)
  }

  /**
   * Delete a specific notification
   */
  const handleDeleteNotification = (id: number) => {
    deleteNotification(id)
    setActiveNotification(null)
  }

  /**
   * Clear all notifications
   */
  const handleClearAll = () => {
    clearAll()
    setIsSheetOpen(false)
  }

  /**
   * Handle notification press - mark as read and navigate
   */
  const handleNotificationPress = (notification: NotificationItem) => {
    if (notification.unread) {
      markAsRead(notification.id)
    }
    // TODO: Navigate to related content
    // router.push(...)
  }

  // Check if content is scrollable
  useEffect(() => {
    if (layoutHeight > 0 && contentHeight > 0) {
      setIsScrollable(contentHeight > layoutHeight + 10)
    }
  }, [layoutHeight, contentHeight])

  return (
    <YStack flex={1} backgroundColor="$background">
      <NotificationHeader
        unreadCount={unreadCount}
        isConnected={isConnected}
        onMorePress={() => setIsSheetOpen(true)}
      />

      <NotificationList
        notifications={notifications}
        isScrollable={isScrollable}
        onNotificationPress={handleNotificationPress}
        onMorePress={setActiveNotification}
        onLayout={e => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(w, h) => setContentHeight(h)}
      />

      <GlobalActionsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllAsRead={handleMarkAllRead}
        onClearAll={handleClearAll}
      />

      <NotificationSheet
        notification={activeNotification}
        onOpenChange={open => {
          if (!open) setActiveNotification(null)
        }}
        onDelete={handleDeleteNotification}
      />
    </YStack>
  )
}
