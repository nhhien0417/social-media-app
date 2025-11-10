import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'

export default function ProfileLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <YStack flex={1} backgroundColor="$background">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="edit"
            options={{
              presentation: 'card',
            }}
          />
        </Stack>
      </YStack>
    </SafeAreaView>
  )
}
