import React, { useEffect } from 'react'
import { Slot, SplashScreen } from 'expo-router'
import { useFonts } from 'expo-font'
import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'

import { ThemeProvider, useAppTheme } from '@/providers/ThemeProvider'
import { QueryProvider } from '@/providers/Query'

SplashScreen.preventAutoHideAsync()

function RootContent() {
  const { isLoading } = useAppTheme()

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync()
    }
  }, [isLoading])

  if (isLoading) return null

  return (
    <QueryProvider>
      <Slot />
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
