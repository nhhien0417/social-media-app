import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  YStack,
  Input,
  Button,
  Text,
  Paragraph,
  SizableText,
  ScrollView,
  Spinner,
  XStack,
} from 'tamagui'
import { ChevronLeft, Eye, EyeOff } from '@tamagui/lucide-icons'
import ButtonIcon from '@/components/IconButton'
import { Pressable } from 'react-native'

export default function ChangePasswordScreen() {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Call API to change password
      // await changePasswordApi(currentPassword, newPassword)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.back()
    } catch (err) {
      setError('Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <YStack paddingHorizontal="$4" paddingVertical="$4">
        {/* Header */}
        <XStack alignItems="center" marginBottom="$4">
          <Pressable onPress={router.back} hitSlop={8}>
            <ChevronLeft size={25} color="$color" />
          </Pressable>
          <SizableText
            size="$6"
            fontWeight="700"
            flex={1}
            textAlign="center"
            marginRight="$8"
          >
            Change Password
          </SizableText>
        </XStack>

        <YStack gap="$4" paddingHorizontal="$2">
          <Paragraph color="$color" opacity={0.7}>
            Your new password must be different from previous used passwords.
          </Paragraph>

          {/* Current Password */}
          <YStack gap="$2">
            <Text fontWeight="600" fontSize="$4">
              Current Password
            </Text>
            <XStack alignItems="center" position="relative">
              <Input
                flex={1}
                value={currentPassword}
                onChangeText={text => {
                  setCurrentPassword(text)
                  if (error) setError('')
                }}
                size="$5"
                placeholder="••••••••••"
                secureTextEntry={!showCurrentPassword}
                borderColor={error ? '$red10' : '$borderColor'}
                borderRadius="$6"
                backgroundColor="$backgroundPress"
                paddingRight={50}
                placeholderTextColor="$placeholderColor"
              />
              <ButtonIcon
                position="absolute"
                right={10}
                Icon={showCurrentPassword ? EyeOff : Eye}
                Size={20}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            </XStack>
          </YStack>

          {/* New Password */}
          <YStack gap="$2">
            <Text fontWeight="600" fontSize="$4">
              New Password
            </Text>
            <XStack alignItems="center" position="relative">
              <Input
                flex={1}
                value={newPassword}
                onChangeText={text => {
                  setNewPassword(text)
                  if (error) setError('')
                }}
                size="$5"
                placeholder="••••••••••"
                secureTextEntry={!showNewPassword}
                borderColor={error ? '$red10' : '$borderColor'}
                borderRadius="$6"
                backgroundColor="$backgroundPress"
                paddingRight={50}
                placeholderTextColor="$placeholderColor"
              />
              <ButtonIcon
                position="absolute"
                right={10}
                Icon={showNewPassword ? EyeOff : Eye}
                Size={20}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            </XStack>
          </YStack>

          {/* Confirm Password */}
          <YStack gap="$2">
            <Text fontWeight="600" fontSize="$4">
              Confirm Password
            </Text>
            <XStack alignItems="center" position="relative">
              <Input
                flex={1}
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text)
                  if (error) setError('')
                }}
                size="$5"
                placeholder="••••••••••"
                secureTextEntry={!showConfirmPassword}
                borderColor={error ? '$red10' : '$borderColor'}
                borderRadius="$6"
                backgroundColor="$backgroundPress"
                paddingRight={50}
                placeholderTextColor="$placeholderColor"
              />
              <ButtonIcon
                position="absolute"
                right={10}
                Icon={showConfirmPassword ? EyeOff : Eye}
                Size={20}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </XStack>
            {!!error && (
              <Text color="$red10" fontSize="$2">
                {error}
              </Text>
            )}
          </YStack>

          <Button
            size="$5"
            theme="primary"
            borderRadius="$7"
            fontWeight="700"
            marginTop="$4"
            onPress={handleChangePassword}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : null}
            fontSize={16}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
