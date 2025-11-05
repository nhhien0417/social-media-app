import { Slot } from 'expo-router'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '../tamagui.config'
import { QueryProvider } from '@/providers/Query'
import { ThemeProvider } from '@/providers/ThemeProvider'

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <ThemeProvider>
        <QueryProvider>
          <Slot />
        </QueryProvider>
      </ThemeProvider>
    </TamaguiProvider>
  )
}
