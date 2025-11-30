import { Link, useRouter } from 'expo-router'
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
import { ChevronLeft } from '@tamagui/lucide-icons'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Call API to send OTP
      // await sendOtpApi(email)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push({
        pathname: '/auth/verify',
        params: { email },
      })
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
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
          Forgot Password
        </SizableText>
        <Paragraph
          color="#888"
          marginBottom="$6"
          fontSize="$4"
          textAlign="center"
        >
          Enter your email address and we'll send you a code to reset your
          password.
        </Paragraph>

        {/* Form */}
        <YStack width="100%" maxWidth={400} gap="$4">
          <YStack gap="$2">
            <XStack justifyContent="space-between">
              <Text fontWeight="600" fontSize="$4">
                Email
              </Text>
              {!!error && (
                <Text color="$red10" fontSize="$2">
                  {error}
                </Text>
              )}
            </XStack>
            <Input
              value={email}
              onChangeText={text => {
                setEmail(text)
                if (error) setError('')
              }}
              size="$5"
              placeholder="you@example.com"
              borderColor={error ? '$red10' : '$borderColor'}
              borderRadius="$6"
              backgroundColor="$backgroundPress"
              placeholderTextColor="$placeholderColor"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </YStack>

          <Button
            size="$5"
            theme="primary"
            borderRadius="$7"
            fontWeight="700"
            onPress={handleSendOTP}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : null}
            fontSize={18}
          >
            {isLoading ? 'Sending Code...' : 'Send Code'}
          </Button>
        </YStack>

        {/* Footer */}
        <XStack gap="$1" marginTop="$6" alignItems="center">
          <Paragraph color="#888">Remember your password?</Paragraph>
          <Link href="/auth/signin" asChild>
            <Text marginLeft="$2" color="$primary" fontWeight="700">
              Login
            </Text>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
