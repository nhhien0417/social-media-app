import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthLayout() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'transparent',
      }}
      edges={['top', 'bottom']}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  )
}
