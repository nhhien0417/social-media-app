import React, { useEffect, useState } from 'react'
import { Stack, SplashScreen } from 'expo-router'
import { StatusBar } from 'react-native'
import { useFonts } from 'expo-font'
import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'

import { ThemeProvider, useAppTheme } from '@/providers/ThemeProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { NotificationProvider } from '@/providers/NotificationProvider'
import { PostStatusProvider } from '@/providers/PostStatusProvider'
import { getUserId } from '@/utils/SecureStore'

SplashScreen.preventAutoHideAsync()

function RootContent() {
  const { isLoading, themeName } = useAppTheme()
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoadingUserId, setIsLoadingUserId] = useState(true)

  // Update StatusBar style based on theme
  useEffect(() => {
    StatusBar.setBarStyle(
      themeName === 'dark' ? 'light-content' : 'dark-content'
    )
  }, [themeName])

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await getUserId()
        if (storedUserId) {
          setUserId(storedUserId)
          console.log('Loaded userId from storage:', storedUserId)
        } else {
          console.log('⚠️ No userId found in storage')
        }
      } catch (error) {
        console.error('Failed to load userId:', error)
      } finally {
        setIsLoadingUserId(false)
      }
    }

    loadUserId()
  }, [])

  useEffect(() => {
    if (!isLoading && !isLoadingUserId) {
      SplashScreen.hideAsync()
    }
  }, [isLoading, isLoadingUserId])

  if (isLoading || isLoadingUserId) return null

  return (
    <QueryProvider>
      <PostStatusProvider>
        <NotificationProvider userId={userId}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="message" />
            <Stack.Screen name="profile" />
            <Stack.Screen
              name="post/[id]"
              options={{
                presentation: 'modal',
                animation: 'fade',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="create"
              options={{
                presentation: 'modal',
                animation: 'fade',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="story"
              options={{
                presentation: 'modal',
                animation: 'fade',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="call"
              options={{
                presentation: 'modal',
                animation: 'fade',
                headerShown: false,
              }}
            />
          </Stack>
        </NotificationProvider>
      </PostStatusProvider>
    </QueryProvider>
  )
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) return null

  return (
    <TamaguiProvider config={config}>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </TamaguiProvider>
  )
}
