import { useState, useEffect } from 'react'
import { YStack } from 'tamagui'
import { useNotifications } from '@/providers/NotificationProvider'
import type { Notification } from '@/types/Notification'
import NotificationHeader from './components/NotificationHeader'
import NotificationList from './components/NotificationList'
import GlobalActionsSheet from './components/GlobalActionsSheet'
import NotificationSheet from './components/NotificationSheet'

export default function NotificationScreen() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    deleteNotification,
    clearAll,
    handleNotificationPress,
  } = useNotifications()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)
  const [layoutHeight, setLayoutHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)

  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null)

  const handleMarkAllRead = () => {
    markAllAsRead()
    setIsSheetOpen(false)
  }

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id)
    setActiveNotification(null)
  }

  const handleClearAll = () => {
    clearAll()
    setIsSheetOpen(false)
  }

  useEffect(() => {
    if (layoutHeight > 0 && contentHeight > 0) {
      setIsScrollable(contentHeight > layoutHeight + 10)
    }
  }, [layoutHeight, contentHeight])

  return (
    <YStack flex={1} backgroundColor="$background">
      <NotificationHeader onMorePress={() => setIsSheetOpen(true)} />

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
