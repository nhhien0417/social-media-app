import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, XStack, YStack, useThemeName } from 'tamagui'
import { profileMock } from '@/mock/profile'
import { EditProfileForm } from '@/features/profile/components/EditProfileForm'

export default function EditProfileScreen() {
  const router = useRouter()
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const background = isDark ? '#000000' : '#FAFAFA' // Instagram colors
  const borderColor = isDark ? '#262626' : '#DBDBDB' // Instagram borders
  const textColor = isDark ? '#FAFAFA' : '#000000'
  const accentColor = '#0095F6' // Instagram blue

  const handleSave = () => {
    router.replace('/profile')
  }

  const handleCancel = () => {
    router.replace('/profile')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <YStack flex={1} backgroundColor={background}>
        <XStack
          alignItems="center"
          paddingHorizontal="$3"
          borderBottomWidth={1}
          borderColor={borderColor}
          gap="$3"
        >
          <Button
            size="$3"
            backgroundColor="transparent"
            borderColor="transparent"
            onPress={handleCancel}
            minWidth={72}
            paddingHorizontal={0}
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
            minWidth={72}
            paddingHorizontal={0}
          >
            <Text fontSize="$4" fontWeight="700" color={accentColor}>
              Done
            </Text>
          </Button>
        </XStack>

        <EditProfileForm user={profileMock} />
      </YStack>
    </SafeAreaView>
  )
}
