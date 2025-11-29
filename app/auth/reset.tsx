import { useRouter, useLocalSearchParams } from 'expo-router'
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
import { Image } from 'react-native'
import { ChevronLeft, Eye, EyeOff } from '@tamagui/lucide-icons'
import ButtonIcon from '@/components/IconButton'

export default function ResetPasswordScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ email: string; code: string }>()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Call API to reset password
      // await resetPasswordApi(params.email, params.code, password)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Navigate to success or login
      router.replace('/auth/signin')
    } catch (err) {
      setError('Failed to reset password. Please try again.')
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
        justifyContent: 'center',
      }}
    >
      <YStack paddingHorizontal="$6" paddingVertical="$6" alignItems="center">
        {/* Back Button */}
        <Button
          position="absolute"
          top={20}
          left={20}
          circular
          size="$3"
          icon={ChevronLeft}
          onPress={() => router.back()}
          chromeless
        />

        {/* Logo */}
        <Image
          source={require('@/assets/logo_0.png')}
          style={{ width: 75, height: 75 }}
        />

        {/* Title */}
        <SizableText
          size="$8"
          fontWeight="700"
          marginTop="$4"
          textAlign="center"
        >
          Reset Password
        </SizableText>
        <Paragraph
          color="#888"
          marginBottom="$6"
          fontSize="$4"
          textAlign="center"
        >
          Create a new password for your account
        </Paragraph>

        {/* Form */}
        <YStack width="100%" maxWidth={400} gap="$4">
          {/* New Password */}
          <YStack gap="$2">
            <Text fontWeight="600" fontSize="$4">
              New Password
            </Text>
            <XStack alignItems="center" position="relative">
              <Input
                flex={1}
                value={password}
                onChangeText={text => {
                  setPassword(text)
                  if (error) setError('')
                }}
                size="$5"
                placeholder="••••••••••"
                secureTextEntry={!showPassword}
                borderColor={error ? '$red10' : '$borderColor'}
                borderRadius="$6"
                backgroundColor="$backgroundPress"
                paddingRight={50}
                placeholderTextColor="$placeholderColor"
              />
              <ButtonIcon
                position="absolute"
                right={10}
                Icon={showPassword ? EyeOff : Eye}
                Size={20}
                onPress={() => setShowPassword(!showPassword)}
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
            marginTop="$2"
            onPress={handleResetPassword}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : null}
            fontSize={18}
          >
            {isLoading ? 'Reset Password' : 'Reset Password'}
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
