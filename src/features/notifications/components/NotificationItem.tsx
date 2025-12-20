import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { YStack, XStack, Text, useThemeName } from 'tamagui'
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
  const users = useProfileStore(state => state.users)
  const router = useRouter()
  const themeName = useThemeName()
  const isDark = themeName.includes('dark')

  const sender = users[notification.senderId]
  const senderName = sender?.username || 'Someone'
  const avatarUrl = sender?.avatarUrl || undefined

  const message = getNotificationMessage(notification.type, senderName)
  const isUnread = !notification.read

  const handleAvatarPress = () => {
    if (notification.senderId) {
      router.push(`/profile/${notification.senderId}`)
    }
  }

  const unreadBgColor = isDark
    ? 'rgba(0, 122, 255, 0.12)'
    : 'rgba(0, 122, 255, 0.08)'
  const normalBgColor = 'transparent'

  return (
    <Pressable
      onPress={() => onPress(notification)}
      style={({ pressed }) => ({
        backgroundColor: isUnread
          ? unreadBgColor
          : pressed
            ? isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.03)'
            : normalBgColor,
      })}
    >
      <XStack alignItems="center" gap="$3" padding="$3">
        <Pressable onPress={handleAvatarPress}>
          <YStack>
            <Avatar uri={avatarUrl} size={56} />
            <YStack
              position="absolute"
              bottom={-2}
              right={-2}
              backgroundColor={isDark ? '#1c1c1e' : 'white'}
              borderRadius={100}
              padding={3}
            >
              {getNotificationIcon(notification.type)}
            </YStack>
          </YStack>
        </Pressable>

        <YStack flex={1}>
          <Text color="$color" fontSize={15}>
            <Text fontWeight="bold" onPress={handleAvatarPress}>
              {senderName}
            </Text>{' '}
            {message.replace(senderName, '').trim()}
          </Text>
          <Text
            color={isDark ? '#8e8e93' : '#8e8e93'}
            fontSize={13}
            marginTop={2}
          >
            {formatDate(notification.createdAt)}
          </Text>
        </YStack>

        {isUnread && (
          <YStack
            width={8}
            height={8}
            borderRadius={5}
            backgroundColor="#007aff"
          />
        )}

        <Pressable
          onPress={() => onMorePress(notification)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical size={20} color={isDark ? '#8e8e93' : '#8e8e93'} />
        </Pressable>
      </XStack>
    </Pressable>
  )
}
