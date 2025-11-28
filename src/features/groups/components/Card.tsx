import { Image, StyleSheet, Pressable } from 'react-native'
import { XStack, YStack, Text, Button } from 'tamagui'
import { Users, Lock } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { Group } from '@/types/Group'
import { formatNumber } from '@/utils/FormatNumber'

type CardType = 'joined' | 'pending' | 'suggestion'

interface GroupCardProps {
  group: Group
  type: CardType
  isDark: boolean
  onJoinGroup?: (groupId: string) => void
  onCancelRequest?: (groupId: string) => void
  onLeaveGroup?: (groupId: string) => void
  isLoading?: boolean
}

export function GroupCard({
  group,
  type,
  isDark,
  onJoinGroup,
  onCancelRequest,
  onLeaveGroup,
  isLoading = false,
}: GroupCardProps) {
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'

  const avatarUrl =
    group.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=random`

  const handleNavigateToGroup = () => {
    router.push(`/group/${group.id}`)
  }

  return (
    <YStack paddingHorizontal="$4" paddingVertical="$3" gap="$3">
      <XStack alignItems="center" gap="$3">
        <Pressable onPress={handleNavigateToGroup}>
          <YStack style={styles.avatar}>
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          </YStack>
        </Pressable>

        <Pressable style={{ flex: 1 }} onPress={handleNavigateToGroup}>
          <YStack gap="$1">
            <XStack alignItems="center" gap="$2">
              <Text fontSize={14} fontWeight="600" color={textColor}>
                {group.name}
              </Text>
              {group.privacy === 'PRIVATE' && (
                <Lock size={14} color={subtitleColor} />
              )}
            </XStack>
            <XStack alignItems="center" gap="$1">
              <Users size={13} color={subtitleColor} />
              <Text fontSize={13} color={subtitleColor}>
                {formatNumber(group.memberCount)} members
              </Text>
            </XStack>
          </YStack>
        </Pressable>

        {/* JOINED GROUP - No buttons needed */}
        {type === 'joined' && null}

        {/* PENDING REQUEST */}
        {type === 'pending' && (
          <Button
            size="$3"
            backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
            color={textColor}
            borderRadius={8}
            paddingHorizontal="$4"
            fontWeight="600"
            fontSize={14}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onCancelRequest?.(group.id)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}

        {/* SUGGESTION */}
        {type === 'suggestion' && (
          <Button
            size="$3"
            backgroundColor="#0095F6"
            color="#ffffff"
            borderRadius={8}
            paddingHorizontal="$4"
            fontWeight="600"
            fontSize={14}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => onJoinGroup?.(group.id)}
            disabled={isLoading}
          >
            Join
          </Button>
        )}
      </XStack>

      {/* Group Description */}
      {group.description && (
        <Text
          fontSize={13}
          color={subtitleColor}
          numberOfLines={2}
          paddingLeft="$14"
        >
          {group.description}
        </Text>
      )}
    </YStack>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})
