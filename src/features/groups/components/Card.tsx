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
  isLoading?: boolean
}

export function GroupCard({
  group,
  type,
  isDark,
  onJoinGroup,
  onCancelRequest,
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

  const cardBackground = isDark ? '#1a1a1a' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  return (
    <Pressable onPress={handleNavigateToGroup}>
      <YStack
        paddingHorizontal="$4"
        paddingVertical="$3.5"
        gap="$2.5"
        marginHorizontal="$3"
        marginVertical="$1.5"
        backgroundColor={cardBackground}
        borderRadius={12}
        borderColor={borderColor}
        borderWidth={1}
      >
        <XStack alignItems="center" gap="$3">
          <YStack style={styles.avatar}>
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          </YStack>

          <YStack flex={1} gap="$1.5">
            <XStack alignItems="center" gap="$2">
              <Text fontSize={15} fontWeight="700" color={textColor}>
                {group.name}
              </Text>
              {group.privacy === 'PRIVATE' && (
                <Lock size={15} color={subtitleColor} />
              )}
            </XStack>
            <XStack alignItems="center" gap="$1.5">
              <Users size={14} color={subtitleColor} />
              <Text fontSize={13} color={subtitleColor} fontWeight="500">
                {formatNumber(group.memberCount)} members
              </Text>
            </XStack>
          </YStack>

          {/* PENDING REQUEST */}
          {type === 'pending' && (
            <Button
              size="$3"
              backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
              color={textColor}
              borderRadius={10}
              paddingHorizontal="$4"
              fontWeight="600"
              fontSize={13}
              pressStyle={{ opacity: 0.8, scale: 0.97 }}
              onPress={e => {
                e.stopPropagation()
                onCancelRequest?.((group as any).requestId || group.id)
              }}
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
              borderRadius={10}
              paddingHorizontal="$4"
              fontWeight="600"
              fontSize={13}
              pressStyle={{ opacity: 0.9, scale: 0.97 }}
              onPress={e => {
                e.stopPropagation()
                onJoinGroup?.(group.id)
              }}
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
            lineHeight={18}
            marginTop="$1"
          >
            {group.description}
          </Text>
        )}
      </YStack>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})
