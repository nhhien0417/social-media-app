import { YStack, Button, ScrollView } from 'tamagui'
import type { Notification } from '@/types/Notification'
import NotificationItem from './NotificationItem'

interface NotificationListProps {
  notifications: Notification[]
  isScrollable: boolean
  onNotificationPress: (notification: Notification) => void
  onMorePress: (notification: Notification) => void
  onLayout: (event: any) => void
  onContentSizeChange: (width: number, height: number) => void
}

export default function NotificationList({
  notifications,
  isScrollable,
  onNotificationPress,
  onMorePress,
  onLayout,
  onContentSizeChange,
}: NotificationListProps) {
  return (
    <ScrollView
      backgroundColor="$background"
      showsVerticalScrollIndicator={false}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
    >
      <YStack marginBottom="$4">
        {notifications.map(item => (
          <NotificationItem
            key={item.id}
            notification={item}
            onPress={onNotificationPress}
            onMorePress={onMorePress}
          />
        ))}
      </YStack>

      {isScrollable && (
        <YStack alignItems="center" marginTop="$4" marginBottom="$8">
          <Button variant="outlined" borderRadius="$6" color="#888" size="$4">
            See previous notifications
          </Button>
        </YStack>
      )}
    </ScrollView>
  )
}
