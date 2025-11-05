import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  Paragraph,
  Separator,
  SizableText,
  Checkbox,
  Spacer,
  ScrollView,
} from 'tamagui'
import { Chrome, Eye, EyeOff } from '@tamagui/lucide-icons'
import { Image } from 'react-native'

type ValidationErrors = {
  email?: string
  password?: string
}

export default function SignInScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

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
    if (!validate()) {
      return
    }
    await signIn()
    router.replace('/(tabs)')
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
      <YStack paddingHorizontal="$6" paddingVertical="$8" alignItems="center">
        {/* Logo */}
        <Image
          source={require('@/assets/logo_0.png')}
          style={{ width: 150, height: 150 }}
        />

        {/* Title */}
        <SizableText
          size="$8"
          fontWeight="700"
          marginBottom="$1"
          marginTop="$-5"
        >
          Welcome back
        </SizableText>
        <Paragraph color="$gray11" marginBottom="$5" fontSize="$4">
          Please enter your details to login.
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
            <Button
              chromeless
              position="absolute"
              right={10}
              icon={showPassword ? EyeOff : Eye}
              size="$3"
              onPress={() => setShowPassword(!showPassword)}
            />
          </XStack>

          {/* Remember + Forgot */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginTop="$1"
          >
            <XStack alignItems="center" gap="$2">
              <Checkbox
                size="$3"
                checked={remember}
                onCheckedChange={value => setRemember(value === true)}
              >
                <Checkbox.Indicator>
                  <Text>✓</Text>
                </Checkbox.Indicator>
              </Checkbox>
              <Text fontSize="$4" color="$gray11">
                Remember me
              </Text>
            </XStack>
            <Button chromeless size="$3">
              <Text color="$primary" fontWeight="600">
                Forgot password?
              </Text>
            </Button>
          </XStack>

          {/* CTA */}
          <Button
            size="$5"
            theme="primary"
            borderRadius="$7"
            fontWeight="700"
            marginTop="$3"
            onPress={handleLogin}
          >
            Login
          </Button>

          {/* Divider OR */}
          <XStack alignItems="center" gap="$3" marginVertical="$4">
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
        <Spacer size="$5" />
        <XStack gap="$1" alignItems="center">
          <Paragraph color="$gray11">Don’t have an account?</Paragraph>
          <Link href="/(auth)/signup" asChild>
            <Button chromeless>
              <Text color="$primary" fontWeight="700">
                Register
              </Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
