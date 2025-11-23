import { Stack } from 'expo-router'

export default function CallLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  )
}
