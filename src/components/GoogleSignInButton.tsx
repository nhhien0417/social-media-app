import { Button, XStack, Text, Spinner } from 'tamagui'
import { useGoogleSignIn } from '../services/useGoogleSignIn'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'

export const GoogleSignInButton = () => {
  const { isLoading, handleGoogleSignIn } = useGoogleSignIn()
  const router = useRouter()

  const onPress = async () => {
    const result = await handleGoogleSignIn()

    if (result.success) {
      Alert.alert('Thành công', 'Đăng nhập Google thành công!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to home screen
            router.replace('/(tabs)')
          },
        },
      ])
    } else {
      Alert.alert('Lỗi', result.error || 'Đăng nhập thất bại')
    }
  }

  return (
    <Button
      size="$4"
      backgroundColor="$white"
      borderColor="$gray8"
      borderWidth={1}
      onPress={onPress}
      disabled={isLoading}
      pressStyle={{
        backgroundColor: '$gray2',
      }}
    >
      <XStack gap="$3" alignItems="center">
        {isLoading ? (
          <Spinner size="small" color="$gray10" />
        ) : (
          // Google logo SVG
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              fill="#4285F4"
              d="M19.6 10.23c0-.82-.07-1.42-.21-2.05H10v3.72h5.51c-.11.86-.74 2.17-2.12 3.04l-.02.12 3.07 2.38.21.02c1.96-1.81 3.09-4.46 3.09-7.23z"
            />
            <path
              fill="#34A853"
              d="M10 20c2.8 0 5.15-.93 6.86-2.52l-3.26-2.52c-.85.57-2 .97-3.6.97-2.75 0-5.1-1.81-5.93-4.3l-.12.01-3.19 2.47-.04.12C2.48 17.31 5.97 20 10 20z"
            />
            <path
              fill="#FBBC05"
              d="M4.07 11.63c-.21-.62-.33-1.29-.33-1.98 0-.69.12-1.36.32-1.98l-.01-.13-3.23-2.51-.11.05C.31 6.32 0 7.83 0 9.65c0 1.82.31 3.33.74 4.58l3.33-2.6z"
            />
            <path
              fill="#EB4335"
              d="M10 3.96c1.95 0 3.27.84 4.02 1.54l2.93-2.86C15.13.89 12.8 0 10 0 5.97 0 2.48 2.69.74 6.57l3.32 2.6C4.9 5.77 7.25 3.96 10 3.96z"
            />
          </svg>
        )}
        <Text fontSize="$4" fontWeight="500" color="$gray11">
          {isLoading ? 'Logging in...' : 'Sign in with Google'}
        </Text>
      </XStack>
    </Button>
  )
}
