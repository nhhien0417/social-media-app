import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import {
  YStack, XStack, Input, Button, Text, Paragraph, Separator, Theme, SizableText, Checkbox, Spacer
} from 'tamagui'
import {Chrome, Eye, EyeOff } from '@tamagui/lucide-icons'

export default function SignInScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
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
            <Text fontSize={28} fontWeight="900" color="black">▶</Text>
          </YStack>
        </YStack>

        {/* Title */}
        <SizableText size="$8" fontWeight="700" marginBottom="$1">
          Welcome back
        </SizableText>
        <Paragraph opacity={0.65} marginBottom="$5" fontSize="$4">
          Please enter your details to login.
        </Paragraph>

        {/* Form */}
        <YStack width="100%" maxWidth={400} gap="$3">
          {/* Email */}
          <Text fontWeight="600" fontSize="$4">Email</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            size="$5"
            placeholder="uxintace.com"
            borderColor="$gray5"
            borderRadius="$6"
            backgroundColor="$color2"
          />

          {/* Password */}
          <Text fontWeight="600" fontSize="$4">Password</Text>
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

          {/* Remember + Forgot */}
          <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
            <XStack alignItems="center" gap="$2">
              <Checkbox
                size="$3"
                checked={remember}
                onCheckedChange={(value) => setRemember(value === true)}
              >
                <Checkbox.Indicator>
                <Text>✓</Text>
                </Checkbox.Indicator>
              </Checkbox>
              <Text fontSize="$4" opacity={0.8}>Remember me</Text>
            </XStack>
            <Button chromeless size="$3">
              <Text color="#3797EF" fontWeight="600">Forgot password?</Text>
            </Button>
          </XStack>

          {/* CTA */}
          <Button
            size="$5"
            backgroundColor="black"
            color="white"
            borderRadius="$7"
            fontWeight="700"
            marginTop="$3"
            onPress={async () => {
              await signIn()
              router.replace('/(tabs)')
            }}
          >
            Login
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
          <Paragraph opacity={0.7}>Don’t have an account?</Paragraph>
          <Link href="/(auth)/signup" asChild>
            <Button chromeless>
              <Text color="#3797EF" fontWeight="700">Register</Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </Theme>
  )
}
