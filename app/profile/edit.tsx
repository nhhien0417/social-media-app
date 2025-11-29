import { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button, Text, XStack, YStack, useThemeName } from 'tamagui'
import {
  EditProfileForm,
  EditProfileFormRef,
} from '@/features/profile/components/EditProfileForm'
import { useCurrentUser } from '@/hooks/useProfile'
import { ActivityIndicator, Platform } from 'react-native'

export default function EditProfileScreen() {
  const formRef = useRef<EditProfileFormRef>(null)
  const router = useRouter()
  const themeName = useThemeName()
  const currentUser = useCurrentUser()
  const isDark = themeName === 'dark'
  const background = isDark ? '#000000' : '#FFFFFF'
  const borderColor = isDark ? '#262626' : '#DBDBDB'
  const textColor = isDark ? '#FAFAFA' : '#000000'
  const accentColor = '#0095F6'

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (formRef.current && !isSaving) {
      setIsSaving(true)
      try {
        await formRef.current.handleSave()
        router.replace('/profile')
      } catch (error) {
        console.error('Failed to save profile:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleCancel = () => {
    router.replace('/profile')
  }

  if (!currentUser) {
    return (
      <YStack
        flex={1}
        backgroundColor={background}
        alignItems="center"
        justifyContent="center"
      >
        <ActivityIndicator size="large" color={accentColor} />
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
        justifyContent="space-between"
        paddingTop={Platform.OS === 'android' ? 40 : '$3'}
      >
        <Button
          size="$3"
          backgroundColor="transparent"
          borderColor="transparent"
          onPress={handleCancel}
          paddingHorizontal="$2"
        >
          <Text fontSize="$4" color={textColor}>
            Cancel
          </Text>
        </Button>

        <Text fontSize="$5" fontWeight="700" color={textColor}>
          Edit Profile
        </Text>

        <Button
          size="$3"
          backgroundColor="transparent"
          borderColor="transparent"
          onPress={handleSave}
          paddingHorizontal="$2"
          disabled={isSaving}
          opacity={isSaving ? 0.5 : 1}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={accentColor} />
          ) : (
            <Text fontSize="$4" fontWeight="700" color={accentColor}>
              Done
            </Text>
          )}
        </Button>
      </XStack>

      <EditProfileForm ref={formRef} user={currentUser} isOwnProfile={true} />
    </YStack>
  )
}
