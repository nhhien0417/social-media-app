import { Text, YStack, useThemeName } from 'tamagui'
import { ProfileComponentProps } from '../ProfileScreen'

export function ProfileBio({ user }: ProfileComponentProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const bioColor = isDark ? 'rgba(255,255,255,0.8)' : '#111827'

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || user.firstName || user.lastName

  return (
    <YStack gap="$1" paddingHorizontal="$3">
      <Text fontSize="$5" fontWeight="500" color={bioColor}>
        {fullName}
      </Text>
      {user.bio && (
        <Text fontSize="$4" color={bioColor}>
          {user.bio}
        </Text>
      )}
    </YStack>
  )
}
