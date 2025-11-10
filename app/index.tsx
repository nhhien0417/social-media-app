import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { getAccessToken } from '@/utils/SecureStore'
import { YStack, Spinner } from 'tamagui'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await getAccessToken()

      if (token) {
        router.replace('/(tabs)')
      } else {
        router.replace('/auth/signin')
      }
    } catch (error) {
      router.replace('/auth/signin')
    } finally {
    }
  }

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$background"
    >
      <Spinner size="large" />
    </YStack>
  )
}
