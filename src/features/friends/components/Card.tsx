import { Image, StyleSheet, Pressable } from 'react-native'
import { XStack, YStack, Text, Button } from 'tamagui'
import { UserPlus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { User } from '@/types/User'
import { getUserId } from '@/utils/SecureStore'

type CardType = 'friend' | 'request' | 'sent' | 'suggestion'

interface UserCardProps {
  user: User
  type: CardType
  isDark: boolean
  onAddFriend?: (userId: string) => void
  onAccept?: (userId: string) => void
  onReject?: (userId: string) => void
  onCancel?: (userId: string) => void
  onUnfriend?: (userId: string) => void
  isLoading?: boolean
}

export function UserCard({
  user,
  type,
  isDark,
  onAddFriend,
  onAccept,
  onReject,
  onCancel,
  onUnfriend,
  isLoading = false,
}: UserCardProps) {
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'

  const handleNavigateToProfile = async () => {
    const currentUserId = await getUserId()
    if (currentUserId && user.id === currentUserId) {
      router.push('/(tabs)/profile')
    } else {
      router.push({
        pathname: '/profile/[id]',
        params: { id: user.id },
      })
    }
  }

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      gap="$3"
    >
      <Pressable onPress={handleNavigateToProfile}>
        <YStack style={styles.avatar}>
          <Image
            source={{ uri: user.avatarUrl || undefined }}
            style={styles.avatarImage}
          />
        </YStack>
      </Pressable>

      <Pressable style={{ flex: 1 }} onPress={handleNavigateToProfile}>
        <YStack gap="$1">
          <Text fontSize={14} fontWeight="600" color={textColor}>
            {user.username}
          </Text>
          <Text fontSize={13} color={subtitleColor}>
            {user.email}
          </Text>
        </YStack>
      </Pressable>

      {/* FRIEND */}
      {type === 'friend' && (
        <XStack gap="$2">
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
            disabled={isLoading}
          >
            Message
          </Button>

          <Button
            size="$3"
            backgroundColor={isDark ? 'rgba(255,255,255,0.08)' : '#fee2e2'}
            color={isDark ? '#d99797ff' : '#b91c1c'}
            borderRadius={8}
            paddingHorizontal="$4"
            fontWeight="600"
            fontSize={14}
            pressStyle={{ opacity: 0.9 }}
            onPress={() => onUnfriend?.(user.id)}
            disabled={isLoading}
          >
            Unfriend
          </Button>
        </XStack>
      )}

      {/* REQUEST */}
      {type === 'request' && (
        <XStack gap="$2">
          <Button
            size="$3"
            backgroundColor="#0099ffff"
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

      {/* SENT */}
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
          onPress={() => onCancel?.(user.id)}
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
          Add Friend
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
