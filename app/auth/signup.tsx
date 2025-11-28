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
import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { Image } from 'react-native'
import { signUpApi, signInApi } from '@/api/api.auth'
import { updateProfileApi } from '@/api/api.profile'
import { getAvatarUrl } from '@/utils/Avatar'
import { saveTokens, saveUserId } from '@/utils/SecureStore'
import { urlToDataURI } from '@/utils/ConvertData'
import ButtonIcon from '@/components/IconButton'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'

type ValidationErrors = {
  email?: string
  username?: string
  password?: string
  confirmPassword?: string
  api?: string
}

export default function SignUpScreen() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      // 1. Sign Up
      const signupResponse = await signUpApi({ email, username, password })
      console.log('API Response:', signupResponse)

      // 2. Sign In
      const signinResponse = await signInApi({ email, password })
      console.log('API Response:', signinResponse)

      const { accessToken, refreshToken, id } = signinResponse.data
      await saveTokens(accessToken, refreshToken)
      await saveUserId(id)

      // 3. Generate and Upload Avatar
      try {
        const avatarUrl = getAvatarUrl(username)
        const dataURI = await urlToDataURI(avatarUrl)
        await updateProfileApi(
          { userId: id },
          {
            uri: dataURI,
            name: 'avatar.png',
            type: 'image/png',
          }
        )
      } catch (avatarError) {
        console.error('Failed to auto-generate avatar:', avatarError)
      }

      router.replace('/(tabs)')
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
        <Paragraph color="#888" marginBottom="$3" fontSize="$4">
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

          {/* Username */}
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontWeight="600" fontSize="$4">
              Username
            </Text>
            {errors.username && (
              <Text color="$red10" fontSize="$2" marginRight="$1">
                {errors.username}
              </Text>
            )}
          </XStack>
          <Input
            value={username}
            onChangeText={text => {
              setUsername(text)
              if (errors.username)
                setErrors(prev => ({ ...prev, username: undefined }))
            }}
            size="$5"
            placeholder="John Doe"
            borderColor={errors.username ? '$red10' : '$borderColor'}
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

          {/* Confirm Password */}
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontWeight="600" fontSize="$4">
              Confirm Password
            </Text>
            {errors.confirmPassword && (
              <Text color="$red10" fontSize="$2" marginRight="$1">
                {errors.confirmPassword}
              </Text>
            )}
          </XStack>
          <XStack alignItems="center" position="relative">
            <Input
              flex={1}
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text)
                if (errors.confirmPassword)
                  setErrors(prev => ({ ...prev, confirmPassword: undefined }))
              }}
              size="$5"
              placeholder="••••••••"
              secureTextEntry={!showConfirmPassword}
              borderColor={errors.confirmPassword ? '$red10' : '$borderColor'}
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

          {/* Policy text */}
          <Paragraph color="#888" fontSize="$3" marginTop="$1">
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
            fontSize={18}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>

          {/* Divider OR */}
          <XStack alignItems="center" gap="$3" marginVertical="$2">
            <Separator flex={1} />
            <Paragraph color="#888">OR</Paragraph>
            <Separator flex={1} />
          </XStack>

          {/* Social login */}
          <GoogleSignInButton />
        </YStack>

        {/* Footer */}
        <XStack marginTop="$2" gap="$1" alignItems="center">
          <Paragraph color="#888">Already have an account?</Paragraph>
          <Link href="/auth/signin" asChild>
            <Text marginLeft="$2" color="$primary" fontWeight="700">
              Log in
            </Text>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
