import { useState, useEffect } from 'react'
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Sheet,
  Separator,
} from 'tamagui'
import { useNotifications } from '@/providers/NotificationProvider'
import Avatar from '@/components/Avatar'
import { MoreVertical, Wifi, WifiOff } from '@tamagui/lucide-icons'
import type { NotificationItem } from '@/types/Notification'

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

  // Group notifications by section (Today, Yesterday, etc.)
  const grouped = notifications.reduce<Record<string, NotificationItem[]>>(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    },
    {}
  )

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
      {/* Top Bar with title, unread count, and connection status */}
      <XStack
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        padding="$3"
      >
        <XStack alignItems="center" gap="$2">
          <Text fontSize="$7" fontWeight="700" color="$color">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <YStack
              backgroundColor="$red10"
              borderRadius="$10"
              paddingHorizontal="$2"
              paddingVertical="$1"
              minWidth={20}
              alignItems="center"
            >
              <Text fontSize="$2" fontWeight="700" color="white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </YStack>
          )}
        </XStack>

        <XStack gap="$2" alignItems="center">
          {/* Connection status indicator */}
          {isConnected ? (
            <Wifi size={16} color="$green10" />
          ) : (
            <WifiOff size={16} color="$red10" />
          )}

          <Button
            size="$3"
            chromeless
            onPress={() => setIsSheetOpen(true)}
            color="$color"
            icon={<MoreVertical size={24} />}
          />
        </XStack>
      </XStack>

      {/* --- CONTENT --- */}
      <ScrollView
        backgroundColor="$background"
        showsVerticalScrollIndicator={false}
        onLayout={e => setLayoutHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(w, h) => setContentHeight(h)}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        {(Object.entries(grouped) as [string, NotificationItem[]][]).map(
          ([section, items]) => (
            <YStack key={section} marginBottom="$4">
              <Text
                color="$color"
                fontWeight="700"
                fontSize="$5"
                marginBottom="$2"
              >
                {section}
              </Text>

              {items.map(item => (
                <YStack
                  key={item.id}
                  backgroundColor={
                    item.unread ? '$backgroundPress' : '$background'
                  }
                  borderRadius="$4"
                  padding="$3"
                  marginBottom="$2"
                  pressStyle={{ opacity: 0.8 }}
                  onPress={() => handleNotificationPress(item)}
                >
                  <XStack alignItems="center" gap="$3">
                    <Avatar uri={item.avatar} size={60} />
                    <YStack flex={1}>
                      <Text color="$color" fontSize="$4">
                        {item.message}
                      </Text>
                      <Text color="$gray8" fontSize="$3" marginTop={2}>
                        {item.time}
                      </Text>
                    </YStack>

                    {/* Unread indicator */}
                    {item.unread && (
                      <YStack
                        width={8}
                        height={8}
                        borderRadius="$10"
                        backgroundColor="$blue10"
                      />
                    )}

                    {/* ✅ Nút 3 chấm cho từng item */}
                    <Button
                      size="$3"
                      chromeless
                      onPress={() => setActiveNotification(item)}
                      icon={<MoreVertical size={20} color="$color" />}
                    />
                  </XStack>

                  {item.actions && (
                    <XStack gap="$2" marginTop="$3">
                      {item.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          flex={1}
                          theme={
                            action.type === 'primary' ? 'primary' : undefined
                          }
                          {...(action.type === 'primary'
                            ? {}
                            : { variant: 'outlined' })}
                          borderRadius="$6"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </XStack>
                  )}
                </YStack>
              ))}
            </YStack>
          )
        )}

        {isScrollable && (
          <YStack alignItems="center" marginTop="$4" marginBottom="$8">
            <Button
              variant="outlined"
              borderRadius="$6"
              color="$gray9"
              size="$4"
            >
              See previous notifications
            </Button>
          </YStack>
        )}
      </ScrollView>

      {/* --- GLOBAL SHEET (Mark all as read) --- */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        modal
        snapPointsMode="fit"
        dismissOnSnapToBottom
        animation="quick"
      >
        <Sheet.Overlay backgroundColor="$shadow6" />
        <Sheet.Handle backgroundColor="$gray6" />
        <Sheet.Frame
          backgroundColor="$background"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          padding="$4"
          alignItems="center"
          justifyContent="center"
          gap="$4"
        >
          <Button
            size="$5"
            theme="primary"
            borderRadius="$6"
            onPress={handleMarkAllRead}
            width="100%"
            disabled={unreadCount === 0}
          >
            Mark all as read {unreadCount > 0 && `(${unreadCount})`}
          </Button>

          <Button
            size="$5"
            variant="outlined"
            borderRadius="$6"
            onPress={handleClearAll}
            width="100%"
            disabled={notifications.length === 0}
          >
            Clear all notifications
          </Button>

          <Button
            variant="outlined"
            borderRadius="$6"
            color="$gray9"
            onPress={() => setIsSheetOpen(false)}
            width="100%"
          >
            Cancel
          </Button>
        </Sheet.Frame>
      </Sheet>

      {/* --- PER-NOTIFICATION SHEET --- */}
      <Sheet
        open={!!activeNotification}
        onOpenChange={(open: boolean) => {
          if (!open) setActiveNotification(null)
        }}
        modal
        snapPointsMode="fit"
        dismissOnSnapToBottom
        animation="quick"
      >
        <Sheet.Overlay backgroundColor="$shadow6" />
        <Sheet.Handle backgroundColor="$gray6" />
        <Sheet.Frame
          backgroundColor="$background"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          padding="$4"
          alignItems="center"
          gap="$4"
        >
          {activeNotification && (
            <>
              <Avatar uri={activeNotification.avatar} size={80} />
              <Text
                color="$color"
                textAlign="center"
                fontSize="$5"
                fontWeight="600"
                lineHeight={22}
                maxWidth="100%"
                flexWrap="wrap"
              >
                {activeNotification.message}
              </Text>
              <Text color="$gray8" fontSize="$3">
                {activeNotification.time}
              </Text>

              <Separator marginVertical="$3" />

              <Button
                theme="red"
                borderRadius="$6"
                size="$5"
                width="100%"
                onPress={() => handleDeleteNotification(activeNotification.id)}
              >
                Delete this notification
              </Button>

              <Button
                variant="outlined"
                borderRadius="$6"
                color="$gray9"
                width="100%"
                onPress={() => setActiveNotification(null)}
              >
                Cancel
              </Button>
            </>
          )}
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
