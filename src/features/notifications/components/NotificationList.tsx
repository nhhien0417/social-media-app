import { YStack, XStack, Text, Button, ScrollView, useTheme } from 'tamagui'
import Avatar from '@/components/Avatar'
import {
  MoreVertical,
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Users,
  Bell,
} from '@tamagui/lucide-icons'
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
  const theme = useTheme()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LIKE_POST':
      case 'LIKE_COMMENT':
      case 'STORY_LIKE':
        return (
          <Heart size={14} color="$red10" fill={theme.red10?.get() ?? 'red'} />
        )

      case 'COMMENT_ON_POST':
      case 'REPLY_COMMENT':
      case 'MENTION_COMMENT':
      case 'MENTION_POST':
        return <MessageCircle size={14} color="$blue10" />

      case 'FRIEND_REQUEST':
      case 'FRIEND_REQUEST_ACCEPTED':
        return <UserPlus size={14} color="$green10" />

      case 'SHARE_POST':
        return <Share2 size={14} color="$orange10" />

      case 'GROUP_INVITE':
      case 'GROUP_JOIN_REQUEST':
      case 'GROUP_JOIN_ACCEPTED':
      case 'GROUP_NEW_POST':
        return <Users size={14} color="$purple10" />

      default:
        return <Bell size={14} color="$gray10" />
    }
  }

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
              <YStack>
                <Avatar
                  uri={`https://i.pravatar.cc/150?u=${item.senderId}`}
                  size={60}
                />
                <YStack
                  position="absolute"
                  bottom={-2}
                  right={-2}
                  backgroundColor="$background"
                  borderRadius={100}
                  padding={4}
                  elevation="$1"
                >
                  {getNotificationIcon(item.type)}
                </YStack>
              </YStack>
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
