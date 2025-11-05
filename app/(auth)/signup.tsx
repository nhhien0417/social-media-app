import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  Paragraph,
  Separator,
  SizableText,
  ScrollView,
  Spinner,
} from 'tamagui'
import { Chrome, Eye, EyeOff } from '@tamagui/lucide-icons'
import { Image } from 'react-native'
import { signUpApi } from '@/api/auth.api'
import ButtonIcon from '@/components/IconButton'

type ValidationErrors = {
  email?: string
  fullName?: string
  password?: string
  api?: string
}

export default function SignUpScreen() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validate = () => {
    const newErrors: ValidationErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isEmailValid(email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validate() || isLoading) {
      return
    }
    setIsLoading(true)
    setErrors({})

    try {
      const response = await signUpApi({ email, fullName, password })
      console.log('✅ API Response:', response)
      router.replace('/(auth)/signin')
    } catch (error: any) {
      const apiError =
        error?.response?.data?.message || 'An unknown error occurred.'
      setErrors({ api: apiError })
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
        <SizableText size="$8" fontWeight="700" marginTop="$2">
          Create your account
        </SizableText>
        <Paragraph color="$gray11" marginBottom="$3" fontSize="$4">
          Please fill in your information to sign up
        </Paragraph>

        {/* Form */}
        <YStack width="100%" maxWidth={400} gap="$3">
          {/* Email */}
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontWeight="600" fontSize="$4">
              Email
            </Text>
            {errors.email && (
              <Text color="$red10" fontSize="$2" marginRight="$1">
                {errors.email}
              </Text>
            )}
            {errors.api && (
              <Text color="$red10" fontSize="$2" marginRight="$1">
                {errors.api}
              </Text>
            )}
          </XStack>
          <Input
            value={email}
            onChangeText={text => {
              setEmail(text)
              if (errors.email)
                setErrors(prev => ({ ...prev, email: undefined }))
            }}
            size="$5"
            placeholder="you@example.com"
            borderColor={errors.email ? '$red10' : '$borderColor'}
            borderRadius="$6"
            backgroundColor="$backgroundPress"
            placeholderTextColor="$placeholderColor"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Full name */}
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontWeight="600" fontSize="$4">
              Full Name
            </Text>
            {errors.fullName && (
              <Text color="$red10" fontSize="$2" marginRight="$1">
                {errors.fullName}
              </Text>
            )}
          </XStack>
          <Input
            value={fullName}
            onChangeText={text => {
              setFullName(text)
              if (errors.fullName)
                setErrors(prev => ({ ...prev, fullName: undefined }))
            }}
            size="$5"
            placeholder="John Doe"
            borderColor={errors.fullName ? '$red10' : '$borderColor'}
            borderRadius="$6"
            backgroundColor="$backgroundPress"
            placeholderTextColor="$placeholderColor"
            autoCapitalize="words"
          />

          {/* Password */}
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontWeight="600" fontSize="$4">
              Password
            </Text>
            {errors.password && (
              <Text color="$red10" fontSize="$2" marginRight="$1">
                {errors.password}
              </Text>
            )}
          </XStack>
          <XStack alignItems="center" position="relative">
            <Input
              flex={1}
              value={password}
              onChangeText={text => {
                setPassword(text)
                if (errors.password)
                  setErrors(prev => ({ ...prev, password: undefined }))
              }}
              size="$5"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              borderColor={errors.password ? '$red10' : '$borderColor'}
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

          {/* Policy text */}
          <Paragraph color="$gray11" fontSize="$3" marginTop="$1">
            By signing up, you agree to our{' '}
            <Text fontWeight="700" color="$color">
              Terms
            </Text>
            ,{' '}
            <Text fontWeight="700" color="$color">
              Privacy Policy
            </Text>
            , and{' '}
            <Text fontWeight="700" color="$color">
              Cookies Policy
            </Text>
            .
          </Paragraph>

          {/* CTA */}
          <Button
            size="$5"
            theme="primary"
            borderRadius="$7"
            fontWeight="700"
            marginTop="$2"
            onPress={handleSignUp}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : null}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>

          {/* Divider OR */}
          <XStack alignItems="center" gap="$3" marginVertical="$2">
            <Separator flex={1} />
            <Paragraph color="$gray10">OR</Paragraph>
            <Separator flex={1} />
          </XStack>

          {/* Social login */}
          <Button
            size="$5"
            backgroundColor="$backgroundPress"
            borderRadius="$6"
            icon={Chrome}
            justifyContent="center"
            fontWeight="700"
          >
            Continue with Google
          </Button>
        </YStack>

        {/* Footer */}
        <XStack marginTop="$2" gap="$1" alignItems="center">
          <Paragraph color="$gray11">Already have an account?</Paragraph>
          <Link href="/(auth)/signin" asChild>
            <Text marginLeft="$2" color="$primary" fontWeight="700">
              Log in
            </Text>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
