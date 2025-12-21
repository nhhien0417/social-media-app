import { memo } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { XStack, YStack, Text, useThemeName } from 'tamagui'
import { UserCheck, Clock, Users } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { User } from '@/types/User'
import { useProfileStore } from '@/stores/profileStore'
import { getAvatarUrl } from '@/utils/Avatar'
import Avatar from '@/components/Avatar'

interface UserSearchCardProps {
  user: User
}

export const UserSearchCard = memo(function UserSearchCard({
  user,
}: UserSearchCardProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const { currentUserId } = useProfileStore()

  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const cardBackground = isDark ? '#1a1a1a' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'
  const badgeBackground = isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6'
  const friendBadgeBackground = isDark ? 'rgba(34,197,94,0.2)' : '#dcfce7'
  const friendBadgeColor = isDark ? '#4ade80' : '#16a34a'
  const pendingBadgeBackground = isDark ? 'rgba(251,191,36,0.2)' : '#fef3c7'
  const pendingBadgeColor = isDark ? '#fbbf24' : '#d97706'

  const avatarUrl = user.avatarUrl || getAvatarUrl(user.username || 'user')
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || 'Unknown User'

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return user.username ? user.username[0].toUpperCase() : 'U'
  }

  const handleNavigateToProfile = () => {
    if (currentUserId && user.id === currentUserId) {
      router.push('/(tabs)/profile')
    } else {
      router.push({
        pathname: '/profile/[id]',
        params: { id: user.id },
      })
    }
  }

  const renderStatusBadge = () => {
    // Don't show badge for self
    if (currentUserId && user.id === currentUserId) {
      return (
        <XStack
          backgroundColor={badgeBackground}
          paddingHorizontal="$3"
          paddingVertical="$1.5"
          borderRadius={999}
          alignItems="center"
          gap="$1.5"
        >
          <Text fontSize={12} fontWeight="600" color={subtitleColor}>
            You
          </Text>
        </XStack>
      )
    }

    switch (user.friendStatus) {
      case 'FRIEND':
        return (
          <XStack
            backgroundColor={friendBadgeBackground}
            paddingHorizontal="$3"
            paddingVertical="$1.5"
            borderRadius={999}
            alignItems="center"
            gap="$1.5"
          >
            <UserCheck size={14} color={friendBadgeColor} />
            <Text fontSize={12} fontWeight="600" color={friendBadgeColor}>
              Friend
            </Text>
          </XStack>
        )

      case 'OUTGOING_PENDING':
        return (
          <XStack
            backgroundColor={pendingBadgeBackground}
            paddingHorizontal="$3"
            paddingVertical="$1.5"
            borderRadius={999}
            alignItems="center"
            gap="$1.5"
          >
            <Clock size={14} color={pendingBadgeColor} />
            <Text fontSize={12} fontWeight="600" color={pendingBadgeColor}>
              Pending
            </Text>
          </XStack>
        )

      case 'INCOMING_PENDING':
        return (
          <XStack
            backgroundColor={pendingBadgeBackground}
            paddingHorizontal="$3"
            paddingVertical="$1.5"
            borderRadius={999}
            alignItems="center"
            gap="$1.5"
          >
            <Users size={14} color={pendingBadgeColor} />
            <Text fontSize={12} fontWeight="600" color={pendingBadgeColor}>
              Respond
            </Text>
          </XStack>
        )

      default:
        return null
    }
  }

  return (
    <Pressable onPress={handleNavigateToProfile}>
      <XStack
        padding="$3"
        margin="$2"
        backgroundColor={cardBackground}
        borderRadius={12}
        borderColor={borderColor}
        borderWidth={1}
        alignItems="center"
        gap="$3"
      >
        <Avatar uri={avatarUrl || undefined} style={styles.avatar} />

        <YStack flex={1} gap="$1">
          <Text fontSize={16} fontWeight="700" color={textColor}>
            {displayName}
          </Text>
          {user.username && (
            <Text fontSize={13} color={subtitleColor}>
              @{user.username}
            </Text>
          )}
        </YStack>

        {renderStatusBadge()}
      </XStack>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: 'hidden',
  },
})
