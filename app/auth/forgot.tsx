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
import { forgotPasswordApi } from '@/api/api.auth'
import { CheckCircle } from '@tamagui/lucide-icons'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSendNewPassword = async () => {
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
      await forgotPasswordApi(email)
      console.log('Password reset link sent successfully')
      setIsSuccess(true)
    } catch (err: any) {
      console.log(err)
      setError('Failed to send new password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <ScrollView
        flex={1}
        backgroundColor="$background"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}
      >
        <YStack
          paddingHorizontal="$6"
          paddingVertical="$6"
          alignItems="center"
          gap="$4"
        >
          <CheckCircle size={80} color="$green10" />
          <SizableText size="$8" fontWeight="700" textAlign="center">
            Password Sent!
          </SizableText>
          <Paragraph
            color="#888"
            fontSize="$4"
            textAlign="center"
            maxWidth={300}
          >
            A new password has been sent to your email. Please check your inbox
            and use it to login.
          </Paragraph>
          <Button
            size="$5"
            theme="primary"
            borderRadius="$7"
            fontWeight="700"
            marginTop="$4"
            onPress={() => router.replace('/auth/signin')}
            fontSize={18}
            width="100%"
            maxWidth={400}
          >
            Back to Login
          </Button>
        </YStack>
      </ScrollView>
    )
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
          Enter your email address and we'll send you a new password.
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
            onPress={handleSendNewPassword}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : null}
            fontSize={18}
          >
            {isLoading ? 'Sending...' : 'Send New Password'}
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
