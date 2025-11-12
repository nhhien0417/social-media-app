import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack, useTheme } from 'tamagui'

export default function ProfileLayout() {
  const theme = useTheme()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme?.background?.val ?? 'white',
      }}
      edges={['top', 'bottom']}
    >
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
