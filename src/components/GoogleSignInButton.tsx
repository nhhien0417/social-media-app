import { Button, XStack, Text, Spinner, YStack } from 'tamagui'
import { useGoogleSignIn } from '../services/useGoogleSignIn'
import { useRouter } from 'expo-router'
import Svg, { G, Path } from 'react-native-svg'

export const GoogleSignInButton = () => {
  const { isLoading, handleGoogleSignIn } = useGoogleSignIn()
  const router = useRouter()

  const onPress = async () => {
    const result = await handleGoogleSignIn()

    if (result.success) {
      console.log('Google sign-in success, navigating to home...')
      router.replace('/(tabs)')
    } else {
      console.log('Google sign-in failed:', result.error)
    }
  }

  return (
    <Button
      size="$5"
      backgroundColor="white"
      borderColor="#dadce0"
      borderWidth={1}
      onPress={onPress}
      disabled={isLoading}
      height={48}
      paddingHorizontal="$4"
      borderRadius="$4"
      pressStyle={{
        backgroundColor: '#f8f9fa',
        borderColor: '#dadce0',
        scale: 0.98,
      }}
      hoverStyle={{
        backgroundColor: '#f8f9fa',
        borderColor: '#d2d4d7',
      }}
      disabledStyle={{
        backgroundColor: '#f5f5f5',
        opacity: 0.6,
      }}
      focusStyle={{
        borderColor: '#4285f4',
        borderWidth: 2,
      }}
    >
      <XStack gap="$4" alignItems="center" justifyContent="center">
        {isLoading ? (
          <Spinner size="small" color="#4285F4" />
        ) : (
          <YStack
            width={25}
            height={25}
            alignItems="center"
            justifyContent="center"
          >
            <Svg width={25} height={25} viewBox="0 0 48 48">
              <G>
                {/* Blue */}
                <Path
                  fill="#4285F4"
                  d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                />
                {/* Green */}
                <Path
                  fill="#34A853"
                  d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
                />
                {/* Yellow */}
                <Path
                  fill="#FBBC05"
                  d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
                />
                {/* Red */}
                <Path
                  fill="#EA4335"
                  d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
                />
              </G>
            </Svg>
          </YStack>
        )}
        <Text
          fontSize={18}
          fontWeight="700"
          color="#3c4043"
          letterSpacing={0.25}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Text>
      </XStack>
    </Button>
  )
}
