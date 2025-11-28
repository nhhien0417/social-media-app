import { YStack, XStack, Text, Button, ScrollView } from 'tamagui'
import Avatar from '@/components/Avatar'
import { MoreVertical } from '@tamagui/lucide-icons'
import type { NotificationItem } from '@/types/Notification'
import { formatDate } from '@/utils/FormatDate'

interface NotificationListProps {
  notifications: NotificationItem[]
  isScrollable: boolean
  onNotificationPress: (notification: NotificationItem) => void
  onMorePress: (notification: NotificationItem) => void
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
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 24,
      }}
    >
      <YStack marginBottom="$4">
        {notifications.map(item => (
          <YStack
            key={item.id}
            backgroundColor={!item.read ? '$backgroundPress' : '$background'}
            borderRadius="$4"
            padding="$3"
            marginBottom="$2"
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onNotificationPress(item)}
          >
            <XStack alignItems="center" gap="$3">
              <Avatar
                uri={`https://i.pravatar.cc/150?u=${item.senderId}`}
                size={60}
              />
              <YStack flex={1}>
                <Text color="$color" fontSize="$4">
                  {item.message}
                </Text>
                <Text color="$gray8" fontSize="$3" marginTop={2}>
                  {formatDate(item.createdAt)}
                </Text>
              </YStack>

              {!item.read && (
                <YStack
                  width={8}
                  height={8}
                  borderRadius="$10"
                  backgroundColor="$blue10"
                />
              )}

              <Button
                size="$3"
                chromeless
                onPress={() => onMorePress(item)}
                icon={<MoreVertical size={20} color="$color" />}
              />
            </XStack>
          </YStack>
        ))}
      </YStack>

      {isScrollable && (
        <YStack alignItems="center" marginTop="$4" marginBottom="$8">
          <Button variant="outlined" borderRadius="$6" color="$gray9" size="$4">
            See previous notifications
          </Button>
        </YStack>
      )}
    </ScrollView>
  )
}
