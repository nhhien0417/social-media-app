import React, { useEffect, useState } from 'react'
import { YStack, XStack, Text, Button } from 'tamagui'
import Avatar from '@/components/Avatar'
import { MoreVertical } from '@tamagui/lucide-icons'
import type { Notification } from '@/types/Notification'
import { formatDate } from '@/utils/FormatDate'
import { useProfileStore } from '@/stores/profileStore'
import { getNotificationMessage } from '@/utils/NotificationMessage'
import { useRouter } from 'expo-router'
import { getNotificationIcon } from './NotificationIcon'

interface NotificationItemProps {
  notification: Notification
  onPress: (notification: Notification) => void
  onMorePress: (notification: Notification) => void
}

export default function NotificationItem({
  notification,
  onPress,
  onMorePress,
}: NotificationItemProps) {
  const { fetchUser, users } = useProfileStore()
  const [sender, setSender] = useState(users[notification.senderId])
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      if (!sender) {
        const user = await fetchUser(notification.senderId)
        if (user) {
          setSender(user)
        }
      }
    }
    loadUser()
  }, [notification.senderId, fetchUser, sender])

  const senderName = sender?.username || 'Someone'
  const avatarUrl = sender?.avatarUrl || undefined

  const message = getNotificationMessage(notification.type, senderName)

  const handleAvatarPress = () => {
    if (notification.senderId) {
      router.push(`/profile/${notification.senderId}`)
    }
  }

  return (
    <YStack
      backgroundColor={!notification.read ? '$backgroundHover' : '$background'}
      padding="$3"
      pressStyle={{ opacity: 0.8 }}
      onPress={() => onPress(notification)}
    >
      <XStack alignItems="center" gap="$3">
        <YStack
          onPress={e => {
            e.stopPropagation()
            handleAvatarPress()
          }}
        >
          <Avatar uri={avatarUrl} size={65} />
          <YStack
            position="absolute"
            bottom={-2}
            right={-2}
            backgroundColor="$background"
            borderRadius={100}
            padding={4}
            elevation="$1"
          >
            {getNotificationIcon(notification.type)}
          </YStack>
        </YStack>
        <YStack flex={1}>
          <Text color="$color" fontSize={15}>
            <Text
              fontWeight="bold"
              onPress={e => {
                e.stopPropagation()
                handleAvatarPress()
              }}
            >
              {senderName}
            </Text>{' '}
            {message.replace(senderName, '').trim()}
          </Text>
          <Text color="#888" fontSize="$3" marginTop={2}>
            {formatDate(notification.createdAt)}
          </Text>
        </YStack>

        {!notification.read && (
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
          onPress={e => {
            e.stopPropagation()
            onMorePress(notification)
          }}
          icon={<MoreVertical size={20} color="$color" />}
        />
      </XStack>
    </YStack>
  )
}
