import { Text, XStack, YStack, useThemeName } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Pressable } from 'react-native'
import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'
import { formatNumber } from '@/utils/FormatNumber'
import { ProfileComponentProps } from '../ProfileScreen'
import Avatar from '@/components/Avatar'

interface ProfileInfoProps extends ProfileComponentProps {
  onFriendsPress?: () => void
  onGroupsPress?: () => void
  onPostsPress?: () => void
}

export function ProfileInfo({
  user,
  isOwnProfile,
  onFriendsPress,
  onGroupsPress,
  onPostsPress,
}: ProfileInfoProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const captionColor = isDark ? 'rgba(250,250,250,0.6)' : '#8E8E93'
  const ringBackground = isDark ? '#000000' : '#FFFFFF'

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal="$3"
    >
      <LinearGradient
        colors={INSTAGRAM_GRADIENT}
        start={{ x: 0, y: 0.35 }}
        end={{ x: 1, y: 0.65 }}
        style={styles.avatarRing}
      >
        <YStack
          style={[styles.avatarInner, { backgroundColor: ringBackground }]}
          alignItems="center"
          justifyContent="center"
        >
          <YStack style={styles.avatarImageWrapper}>
            <Avatar
              source={{ uri: user.avatarUrl || undefined }}
              style={styles.avatarImage}
              objectFit="cover"
            />
          </YStack>
        </YStack>
      </LinearGradient>

      <XStack flex={1} justifyContent="space-around" marginLeft="$5">
        <Pressable onPress={onPostsPress}>
          <YStack alignItems="center" gap="$1">
            <Text fontSize="$6" fontWeight="700">
              {formatNumber(user.postCount || 0)}
            </Text>
            <Text fontSize="$3" fontWeight="500" color={captionColor}>
              Posts
            </Text>
          </YStack>
        </Pressable>

        <Pressable onPress={onFriendsPress}>
          <YStack alignItems="center" gap="$1">
            <Text fontSize="$6" fontWeight="700">
              {formatNumber(user.friendCount || 0)}
            </Text>
            <Text fontSize="$3" fontWeight="500" color={captionColor}>
              Friends
            </Text>
          </YStack>
        </Pressable>

        <Pressable onPress={onGroupsPress}>
          <YStack alignItems="center" gap="$1">
            <Text fontSize="$6" fontWeight="700">
              {formatNumber(user.groupCount || 0)}
            </Text>
            <Text fontSize="$3" fontWeight="500" color={captionColor}>
              Groups
            </Text>
          </YStack>
        </Pressable>
      </XStack>
    </XStack>
  )
}

const AVATAR_SIZE = 90
const RING_PADDING = 5
const RING_SIZE = AVATAR_SIZE + RING_PADDING * 2

const styles = StyleSheet.create({
  avatarRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    padding: RING_PADDING,
    borderRadius: RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: AVATAR_SIZE + RING_PADDING,
    height: AVATAR_SIZE + RING_PADDING,
    padding: RING_PADDING / 2,
    borderRadius: (AVATAR_SIZE + RING_PADDING) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarImageWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
})
