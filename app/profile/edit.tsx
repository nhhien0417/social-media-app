import { useRouter } from 'expo-router'
import { Button, Text, XStack, YStack, useThemeName } from 'tamagui'
import { EditProfileForm } from '@/features/profile/components/EditProfileForm'
import { useCurrentUser } from '@/hooks/useProfile'

export default function EditProfileScreen() {
  const router = useRouter()
  const themeName = useThemeName()
  const currentUser = useCurrentUser()
  const isDark = themeName === 'dark'
  const background = isDark ? '#000000' : '#FAFAFA'
  const borderColor = isDark ? '#262626' : '#DBDBDB'
  const textColor = isDark ? '#FAFAFA' : '#000000'
  const accentColor = '#0095F6'

  const handleSave = () => {
    router.replace('/profile')
  }

  const handleCancel = () => {
    router.replace('/profile')
  }

  if (!currentUser) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="$6" fontWeight="700">
          Loading...
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor={background}>
      <XStack
        alignItems="center"
        padding="$3"
        borderBottomWidth={1}
        borderColor={borderColor}
        gap="$3"
      >
        <Button
          size="$3"
          backgroundColor="transparent"
          borderColor="transparent"
          onPress={handleCancel}
          paddingHorizontal="$3"
        >
          <Text fontSize="$4" color={textColor}>
            Cancel
          </Text>
        </Button>

        <Text
          flex={1}
          textAlign="center"
          fontSize="$6"
          fontWeight="700"
          color={textColor}
        >
          Edit Profile
        </Text>

        <Button
          size="$3"
          backgroundColor="transparent"
          borderColor="transparent"
          onPress={handleSave}
          paddingHorizontal="$3"
        >
          <Text fontSize="$4" fontWeight="700" color={accentColor}>
            Done
          </Text>
        </Button>
      </XStack>

      <EditProfileForm user={currentUser} isOwnProfile={true} />
    </YStack>
  )
}
