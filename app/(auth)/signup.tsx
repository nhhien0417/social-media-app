import { Link } from 'expo-router'
import { useState } from 'react'
import {
  YStack, XStack, Input, Button, Text, Paragraph, Separator, Theme, SizableText
} from 'tamagui'

export default function SignUpScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [fullName, setFullName] = useState('')
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
        <SizableText size="$9" fontWeight="700" letterSpacing={1} marginBottom="$4">
          Instagram
        </SizableText>

        <YStack maxWidth={420} width="100%" gap="$3">
          <Button
            size="$5"
            backgroundColor="#1877F2"
            pressStyle={{ backgroundColor: '#0f64cf' }}
            color="white"
            borderRadius="$6"
            justifyContent="center"
          >
            Log in with Facebook
          </Button>

          <XStack alignItems="center" gap="$3" marginVertical="$3">
            <Separator flex={1} />
            <Paragraph opacity={0.6}>OR</Paragraph>
            <Separator flex={1} />
          </XStack>

          <Input
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            size="$4"
            borderRadius="$4"
            borderColor="$gray5"
            placeholder="Mobile Number or Email"
            backgroundColor="$gray2"
          />
          <Input
            value={fullName}
            onChangeText={setFullName}
            size="$4"
            borderRadius="$4"
            borderColor="$gray5"
            placeholder="Full Name"
            backgroundColor="$gray2"
          />
          <Input
            value={username}
            onChangeText={setUsername}
            size="$4"
            borderRadius="$4"
            borderColor="$gray5"
            placeholder="Username"
            backgroundColor="$gray2"
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

          <Paragraph fontSize="$2" opacity={0.7} marginTop="$1">
            By signing up, you agree to our <Text fontWeight="700">Terms</Text>,{' '}
            <Text fontWeight="700">Privacy</Text> and <Text fontWeight="700">Cookies Policy</Text>.
          </Paragraph>

          <Button
            size="$5"
            backgroundColor="#3797EF"
            pressStyle={{ backgroundColor: '#2f85d5' }}
            color="white"
            borderRadius="$6"
            marginTop="$2"
          >
            Sign up
          </Button>
        </YStack>

        <YStack marginTop="auto" alignItems="center" width="100%">
          <Separator marginVertical="$3" width="100%" />
          <XStack gap="$2" alignItems="center">
            <Paragraph opacity={0.7}>Have an account?</Paragraph>
            <Link href="/(auth)/signin" asChild>
              <Button chromeless>
                <Text color="#3797EF" fontWeight="700">Log in</Text>
              </Button>
            </Link>
          </XStack>
        </YStack>
      </YStack>
    </Theme>
  )
}
