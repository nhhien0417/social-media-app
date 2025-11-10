import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Text,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
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

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal="$3"
    >
      <Avatar size="$8">
        <AvatarImage src={user.avatarUrl} alt={user.username} />
        <AvatarFallback backgroundColor={isDark ? '#1f2937' : '#e5e7eb'}>
          <Text fontSize="$6" fontWeight="700">
            {user.username[0]?.toUpperCase() ?? 'A'}
          </Text>
        </AvatarFallback>
      </Avatar>

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
