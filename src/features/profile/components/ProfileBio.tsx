import { Link } from 'expo-router'
import { Text, YStack, useThemeName } from 'tamagui'
import type { ProfileUser } from '../../../mock/profile'

interface ProfileBioProps {
  user: ProfileUser
}

export function ProfileBio({ user }: ProfileBioProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const bioColor = isDark ? 'rgba(255,255,255,0.8)' : '#111827'
  const linkColor = '#0095F6'

  return (
    <YStack gap="$1" paddingHorizontal="$3">
      <Text fontSize="$4" fontWeight="600" color={bioColor}>
        {user.username}
      </Text>
      <Text fontSize="$3" color={bioColor}>
        {user.bio}
      </Text>
      {user.link ? (
        <Link href={`https://${user.link}`}>
          <Text fontSize="$3" color={linkColor}>
            {user.link}
          </Text>
        </Link>
      ) : null}
    </YStack>
  )
}
