import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import {
  YStack, XStack, Input, Button, Text, Paragraph, Separator, Theme, SizableText
} from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'

export default function SignInScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Theme name="light">
      <YStack
        flex={1}
        backgroundColor="white"
        paddingHorizontal="$4"
        paddingTop="$6"
        paddingBottom="$6"
        alignItems="center"
      >
        {/* Top bar */}
        <XStack width="100%" alignItems="center" marginBottom="$2" marginTop="$1">
          <Button onPress={() => router.back()} icon={ArrowLeft} size="$3" chromeless circular />
        </XStack>

        {/* Wordmark */}
        <SizableText size="$9" fontWeight="700" letterSpacing={1} marginBottom="$4">
          Instagram
        </SizableText>

        {/* Form */}
        <YStack width="100%" maxWidth={420} gap="$3">
          <Input
            value={username}
            onChangeText={setUsername}
            size="$4"
            borderRadius="$4"
            borderColor="$gray5"
            placeholder="Phone number, username or email"
            backgroundColor="$color2"  
          />
          <Input
            value={password}
            onChangeText={setPassword}
            size="$4"
            borderRadius="$4"
            borderColor="$gray5"
            placeholder="Password"
            secureTextEntry
            backgroundColor="$gray2"
          />

          <XStack justifyContent="flex-end">
            <Link href="/signin" asChild>
              <Button chromeless size="$3">
                <Text color="#3797EF">Forgot password?</Text>
              </Button>
            </Link>
          </XStack>

          <Button
            size="$5"
            backgroundColor="#3797EF"
            pressStyle={{ backgroundColor: '#2f85d5' }}
            color="white"
            borderRadius="$6"
            onPress={async () => {
              await signIn()
              router.replace('/(tabs)')
            }}
          >
            Log in
          </Button>

          {/* Divider OR */}
          <XStack alignItems="center" gap="$3" marginVertical="$3">
            <Separator flex={1} />
            <Paragraph opacity={0.6}>OR</Paragraph>
            <Separator flex={1} />
          </XStack>

          {/* Login with Facebook */}
          <Button size="$5" chromeless onPress={() => {}} justifyContent="center" alignItems="center">
            <XStack alignItems="center" gap="$2">
              <YStack width={22} height={22} borderRadius="$10" backgroundColor="#1877F2" alignItems="center" justifyContent="center">
                <Text color="white" fontWeight="800">f</Text>
              </YStack>
              <Text color="#1877F2" fontWeight="700">Log in with Facebook</Text>
            </XStack>
          </Button>
        </YStack>

        {/* Footer */}
        <YStack marginTop="auto" alignItems="center" width="100%">
          <Separator marginVertical="$3" width="100%" />
          <XStack gap="$2" alignItems="center">
            <Paragraph opacity={0.7}>Don’t have an account?</Paragraph>
            <Link href="/(auth)/signup" asChild>
              <Button chromeless>
                <Text color="#3797EF" fontWeight="700">Sign up.</Text>
              </Button>
            </Link>
          </XStack>
        </YStack>
      </YStack>
    </Theme>
  )
}
