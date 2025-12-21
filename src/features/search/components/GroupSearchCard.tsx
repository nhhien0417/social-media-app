import { memo } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import {
  XStack,
  YStack,
  Text,
  Avatar,
  AvatarImage,
  AvatarFallback,
  useThemeName,
} from 'tamagui'
import { Users, Lock, Clock, Check } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { Group } from '@/types/Group'
import { formatNumber } from '@/utils/FormatNumber'
import { getAvatarUrl } from '@/utils/Avatar'

interface GroupSearchCardProps {
  group: Group
}

export const GroupSearchCard = memo(function GroupSearchCard({
  group,
}: GroupSearchCardProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const cardBackground = isDark ? '#1a1a1a' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  const avatarUrl = group.avatarUrl || getAvatarUrl(group.name || 'group')

  const getInitials = () => {
    if (group.name) {
      const words = group.name.split(' ')
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase()
      }
      return group.name.substring(0, 2).toUpperCase()
    }
    return 'G'
  }

  const handleNavigateToGroup = () => {
    router.push(`/group/${group.id}`)
  }

  return (
    <Pressable onPress={handleNavigateToGroup}>
      <YStack
        padding="$3"
        gap="$2.5"
        margin="$2"
        backgroundColor={cardBackground}
        borderRadius={12}
        borderColor={borderColor}
        borderWidth={1}
      >
        <XStack alignItems="center" gap="$3">
          <Avatar size="$5" circular={false} borderRadius={12}>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback
              backgroundColor={isDark ? '#374151' : '#e5e7eb'}
              borderRadius={12}
            >
              <Text fontWeight="700" color={textColor} fontSize={16}>
                {getInitials()}
              </Text>
            </AvatarFallback>
          </Avatar>

          <YStack flex={1} gap="$1.5">
            <XStack alignItems="center" gap="$2">
              <Text
                fontSize={16}
                fontWeight="700"
                color={textColor}
                numberOfLines={1}
                flex={1}
              >
                {group.name || 'Unknown Group'}
              </Text>
              {group.privacy === 'PRIVATE' && (
                <Lock size={14} color={subtitleColor} />
              )}
            </XStack>
            <XStack alignItems="center" gap="$1.5">
              <Users size={14} color={subtitleColor} />
              <Text fontSize={13} color={subtitleColor} fontWeight="500">
                {formatNumber(group.memberCount || 0)} members
              </Text>
            </XStack>
          </YStack>
        </XStack>

        {group.description && (
          <Text
            fontSize={13}
            color={subtitleColor}
            numberOfLines={2}
            lineHeight={18}
          >
            {group.description}
          </Text>
        )}
      </YStack>
    </Pressable>
  )
})
