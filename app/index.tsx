import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { getAccessToken } from '@/api/token'
import { YStack, Spinner } from 'tamagui'

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = await getAccessToken()
      setIsAuthenticated(!!token)
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/signin'} />
}
