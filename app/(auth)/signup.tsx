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
  Theme,
  SizableText,
  Spacer,
} from 'tamagui'
import { Chrome, Eye, EyeOff } from '@tamagui/lucide-icons'

export default function SignUpScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Theme name="light">
      <YStack
        flex={1}
        backgroundColor="white"
        paddingHorizontal="$6"
        paddingVertical="$8"
        alignItems="center"
        justifyContent="center"
      >
        {/* Logo */}
        <YStack alignItems="center" marginBottom="$4">
          <YStack
            width={60}
            height={60}
            borderRadius={18}
            backgroundColor="$gray3"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={28} fontWeight="900" color="black">
              ▶
            </Text>
          </YStack>
        </YStack>

        {/* Title */}
        <SizableText size="$8" fontWeight="700" marginBottom="$1">
          Create your account
        </SizableText>
        <Paragraph opacity={0.65} marginBottom="$5" fontSize="$4">
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
            borderColor="$gray5"
            borderRadius="$6"
            backgroundColor="$color2"
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
            borderColor="$gray5"
            borderRadius="$6"
            backgroundColor="$color2"
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
              borderColor="$gray5"
              borderRadius="$6"
              backgroundColor="$color2"
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
          <Paragraph fontSize="$3" opacity={0.7} marginTop="$1">
            By signing up, you agree to our <Text fontWeight="700">Terms</Text>,{' '}
            <Text fontWeight="700">Privacy Policy</Text>, and{' '}
            <Text fontWeight="700">Cookies Policy</Text>.
          </Paragraph>

          {/* CTA */}
          <Button
            size="$5"
            backgroundColor="black"
            color="white"
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
            <Paragraph opacity={0.6}>OR</Paragraph>
            <Separator flex={1} />
          </XStack>

          {/* Social login */}
          <Button
            size="$5"
            backgroundColor="$gray2"
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
          <Paragraph opacity={0.7}>Already have an account?</Paragraph>
          <Link href="/(auth)/signin" asChild>
            <Button chromeless>
              <Text color="#3797EF" fontWeight="700">
                Log in
              </Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </Theme>
  )
}
