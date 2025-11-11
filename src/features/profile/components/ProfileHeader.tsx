import { Text, XStack, YStack, useThemeName } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, StyleSheet } from 'react-native'
import type { ProfileUser } from '../../../mock/profile'

interface ProfileHeaderProps {
  user: ProfileUser
}

const formatNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return value.toLocaleString('en-US')
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const captionColor = isDark ? 'rgba(255,255,255,0.7)' : '#4b5563'
  const ringBackground = isDark ? '#050506' : '#ffffff'
  const fallbackBackground = isDark ? '#111827' : '#e2e8f0'

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
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                backgroundColor={fallbackBackground}
              >
                <Text
                  fontSize="$6"
                  fontWeight="700"
                  color={isDark ? '#f8fafc' : '#111827'}
                >
                  {user.username[0]?.toUpperCase() ?? 'A'}
                </Text>
              </YStack>
            )}
          </YStack>
        </YStack>
      </LinearGradient>

      <XStack flex={1} justifyContent="space-around" marginLeft="$6">
        {[
          { label: 'Posts', value: user.stats.posts },
          { label: 'Followers', value: user.stats.followers },
          { label: 'Following', value: user.stats.following },
        ].map(stat => (
          <YStack key={stat.label} alignItems="center" gap="$1">
            <Text fontSize="$5" fontWeight="700">
              {formatNumber(stat.value)}
            </Text>
            <Text fontSize="$2" color={captionColor}>
              {stat.label}
            </Text>
          </YStack>
        ))}
      </XStack>
    </XStack>
  )
}

const INSTAGRAM_GRADIENT = [
  '#f58529',
  '#feda77',
  '#dd2a7b',
  '#8134af',
  '#515bd4',
] as const

const AVATAR_SIZE = 88
const RING_PADDING = 4
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
    resizeMode: 'cover',
  },
  avatarImageWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
})
