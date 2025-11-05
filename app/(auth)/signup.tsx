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
  Spacer,
} from 'tamagui'
import { Chrome, Eye, EyeOff } from '@tamagui/lucide-icons'
import { Image } from 'react-native'

export default function SignUpScreen() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal="$6"
      alignItems="center"
      justifyContent="center"
    >
      {/* Logo */}
      <Image
        source={require('@/assets/logo_0.png')}
        style={{ width: 150, height: 150 }}
      />

      {/* Title */}
      <SizableText size="$8" fontWeight="700" marginBottom="$1" marginTop="$-5">
        Create your account
      </SizableText>
      <Paragraph color="$gray11" marginBottom="$5" fontSize="$4">
        Please fill in your information to sign up.
      </Paragraph>

      {/* Form */}
      <YStack width="100%" maxWidth={400} gap="$3">
        {/* Email */}
        <Text fontWeight="600" fontSize="$4">
          Email
        </Text>
        <Input
          value={email}
          onChangeText={setEmail}
          size="$5"
          placeholder="you@example.com"
          borderColor="$borderColor"
          borderRadius="$6"
          backgroundColor="$backgroundPress"
        />

        {/* Full name */}
        <Text fontWeight="600" fontSize="$4">
          Full Name
        </Text>
        <Input
          value={fullName}
          onChangeText={setFullName}
          size="$5"
          placeholder="John Doe"
          borderColor="$borderColor"
          borderRadius="$6"
          backgroundColor="$backgroundPress"
        />

        {/* Password */}
        <Text fontWeight="600" fontSize="$4">
          Password
        </Text>
        <XStack alignItems="center" position="relative">
          <Input
            flex={1}
            value={password}
            onChangeText={setPassword}
            size="$5"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            borderColor="$borderColor"
            borderRadius="$6"
            backgroundColor="$backgroundPress"
            paddingRight={50}
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
          backgroundColor="$color"
          color="$background"
          borderRadius="$7"
          fontWeight="700"
          marginTop="$3"
          onPress={() => router.replace('/(auth)/signin')}
        >
          Sign up
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
      <Spacer size="$6" />
      <XStack gap="$2" alignItems="center">
        <Paragraph color="$gray11">Already have an account?</Paragraph>
        <Link href="/(auth)/signin" asChild>
          <Button chromeless>
            <Text color="$primary" fontWeight="700">
              Log in
            </Text>
          </Button>
        </Link>
      </XStack>
    </YStack>
  )
}
