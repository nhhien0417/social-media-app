import { Slot } from 'expo-router'
import { TamaguiProvider, Theme } from 'tamagui'
import config from '../tamagui.config'
import { AuthProvider } from '@/providers/Auth'
import { QueryProvider } from '@/providers/Query'

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <AuthProvider>
          <QueryProvider>
              <Slot />
          </QueryProvider>
        </AuthProvider>
      </Theme>
    </TamaguiProvider>
  )
}
