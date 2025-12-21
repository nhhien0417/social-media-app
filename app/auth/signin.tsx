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
import ButtonIcon from '@/components/IconButton'
import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { Image } from 'react-native'
import { signInApi } from '@/api/api.auth'
import { saveTokens, saveUserId } from '@/utils/SecureStore'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { useProfileStore } from '@/stores/profileStore'

type ValidationErrors = {
  email?: string
  password?: string
  api?: string
}

export default function SignInScreen() {
  const router = useRouter()

  const [email, setEmail] = useState('')
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

    if (!password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validate() || isLoading) {
      return
    }
    setIsLoading(true)
    setErrors({})

    try {
      const response = await signInApi({ email, password })
      console.log('API Response:', response)

      if (response && response.data && response.data.accessToken) {
        await saveTokens(response.data.accessToken, response.data.refreshToken)
        await saveUserId(response.data.id)
        
        await useProfileStore.getState().initialize()
      } else {
        throw new Error('Login failed: Invalid response structure.')
      }

      router.replace('/(tabs)')
    } catch (error: any) {
      setErrors({ api: 'Invalid email or password' })
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
          Welcome back
        </SizableText>
        <Paragraph color="#888" marginBottom="$3" fontSize="$4">
          Please enter your details to login
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
            {errors.api && (
              <Text color="$red10" fontSize="$2" marginRight="$1">
                {errors.api}
              </Text>
            )}
          </XStack>
          <XStack alignItems="center" position="relative">
            <Input
              flex={1}
              onChangeText={text => {
                setPassword(text)
                if (errors.password)
                  setErrors(prev => ({ ...prev, password: undefined }))
              }}
              size="$5"
              placeholder="••••••••••"
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

          {/* Remember + Forgot */}
          <Link href="/auth/forgot" asChild>
            <Text
              marginTop="$1"
              textAlign="right"
              color="$primary"
              fontWeight="500"
              fontSize={15}
            >
              Forgot password?
            </Text>
          </Link>

          {/* CTA */}
          <Button
            size="$5"
            theme="primary"
            borderRadius="$7"
            fontWeight="700"
            marginTop="$2"
            onPress={handleLogin}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="small" /> : null}
            fontSize={18}
          >
            {isLoading ? 'Logging in...' : 'Login'}
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
        <XStack gap="$1" marginTop="$2" alignItems="center">
          <Paragraph color="#888">Don't have an account?</Paragraph>
          <Link href="/auth/signup" asChild>
            <Text marginLeft="$2" color="$primary" fontWeight="700">
              Register
            </Text>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
