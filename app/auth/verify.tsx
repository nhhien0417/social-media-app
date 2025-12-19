import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState, useRef } from 'react'
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
import { Image, Pressable, TextInput } from 'react-native'

export default function VerifyOtpScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ email: string }>()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<Array<TextInput | null>>([])

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const pastedOtp = text.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)
      if (index + pastedOtp.length < 6) {
        inputRefs.current[index + pastedOtp.length]?.focus()
      } else {
        inputRefs.current[5]?.focus()
      }
      return
    }

    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (error) setError('')
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Call API to verify OTP
      // await verifyOtpApi(params.email, otpString)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push({
        pathname: '/auth/reset',
        params: { email: params.email, code: otpString },
      })
    } catch (err) {
      setError('Invalid code. Please try again.')
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
          Verify OTP
        </SizableText>
        <Paragraph
          color="#888"
          marginBottom="$6"
          fontSize="$4"
          textAlign="center"
        >
          Enter the 6-digit code sent to {params.email}
        </Paragraph>

        {/* OTP Inputs */}
        <YStack width="100%" maxWidth={400} gap="$4">
          <YStack gap="$2">
            <XStack justifyContent="space-between" gap="$2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={ref => {
                    inputRefs.current[index] = ref
                  }}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                  fontSize={20}
                  fontWeight="700"
                  width={45}
                  height={55}
                  borderRadius="$4"
                  backgroundColor="$backgroundPress"
                  borderColor={error ? '$red10' : '$borderColor'}
                  selectTextOnFocus
                />
              ))}
            </XStack>
            {!!error && (
              <Text
                color="$red10"
                fontSize="$2"
                textAlign="center"
                marginTop="$2"
              >
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
            onPress={handleVerify}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : null}
            fontSize={18}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </YStack>

        {/* Resend */}
        <XStack gap="$2.5" marginTop="$6" alignItems="center">
          <Paragraph color="#888">Didn't receive code?</Paragraph>
          <Pressable onPress={() => router.push('/auth/signin')}>
            <Text color="$primary" fontWeight="700">
              Resend
            </Text>
          </Pressable>
        </XStack>

        {/* Back to Email */}
        <XStack gap="$2.5" marginTop="$3" alignItems="center">
          <Paragraph color="#888">Incorrect email?</Paragraph>
          <Pressable onPress={() => router.back()}>
            <Text color="$primary" fontWeight="700">
              Change
            </Text>
          </Pressable>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
