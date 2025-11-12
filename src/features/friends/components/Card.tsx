import { Image, StyleSheet } from 'react-native'
import { XStack, YStack, Text, Button } from 'tamagui'
import { UserPlus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import type { ProfileData } from '@/api/api.profile'

type CardType = 'friend' | 'request' | 'sent' | 'suggestion'

interface UserCardProps {
  user: ProfileData
  type: CardType
  isDark: boolean
  onAccept?: (userId: string) => void
  onReject?: (userId: string) => void
  onAddFriend?: (userId: string) => void
  isLoading?: boolean
}

export function UserCard({
  user,
  type,
  isDark,
  onAccept,
  onReject,
  onAddFriend,
  isLoading = false,
}: UserCardProps) {
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'

  const fullName = `${user.firstName} ${user.lastName}`.trim()
  const displayName = fullName || user.email
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      gap="$3"
    >
      <YStack style={styles.avatar}>
        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
      </YStack>

      <YStack flex={1} gap="$1">
        <Text fontSize={14} fontWeight="600" color={textColor}>
          {displayName}
        </Text>
        <Text fontSize={13} color={subtitleColor}>
          {user.email}
        </Text>
      </YStack>

      {type === 'friend' && (
        <Button
          size="$3"
          backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
          color={textColor}
          borderRadius={8}
          paddingHorizontal="$4"
          fontWeight="600"
          fontSize={14}
          pressStyle={{ opacity: 0.8 }}
          onPress={() => router.push(`/message/${user.id}` as any)}
        >
          Message
        </Button>
      )}

      {type === 'request' && (
        <XStack gap="$2">
          <Button
            size="$3"
            backgroundColor="#0095F6"
            color="#ffffff"
            borderRadius={8}
            paddingHorizontal="$4"
            fontWeight="600"
            fontSize={14}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onAccept?.(user.id)}
            disabled={isLoading}
          >
            Accept
          </Button>
          <Button
            size="$3"
            backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
            color={textColor}
            borderRadius={8}
            paddingHorizontal="$4"
            fontWeight="600"
            fontSize={14}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onReject?.(user.id)}
            disabled={isLoading}
          >
            Delete
          </Button>
        </XStack>
      )}

      {type === 'sent' && (
        <Button
          size="$3"
          backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
          color={textColor}
          borderRadius={8}
          paddingHorizontal="$4"
          fontWeight="600"
          fontSize={14}
          pressStyle={{ opacity: 0.8 }}
          onPress={() => onReject?.(user.id)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      )}

      {type === 'suggestion' && (
        <Button
          size="$3"
          backgroundColor="#0095F6"
          color="#ffffff"
          borderRadius={8}
          paddingHorizontal="$4"
          fontWeight="600"
          fontSize={14}
          icon={<UserPlus size={18} color="#ffffff" />}
          pressStyle={{ opacity: 0.8 }}
          onPress={() => onAddFriend?.(user.id)}
          disabled={isLoading}
        >
          Follow
        </Button>
      )}
    </XStack>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})
