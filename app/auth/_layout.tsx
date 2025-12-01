import { Stack, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import { getAccessToken } from '@/utils/SecureStore'

export default function AuthLayout() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAccessToken()
        if (token) {
          router.replace('/(tabs)')
        }
      } catch (error) {
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  if (isChecking) {
    return null
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'transparent',
      }}
      edges={['top', 'bottom']}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          presentation: 'modal',
        }}
      />
    </SafeAreaView>
  )
}
