import MessengerHeader from '@/features/messenger/components/Header'
import { Stack } from 'expo-router'
import { YStack } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MessengerLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <YStack flex={1} backgroundColor="$background">
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              header: () => <MessengerHeader type="list" />,
            }}
          />
          <Stack.Screen
            name="[chatId]"
            options={{
              header: () => <MessengerHeader type="detail" />,
            }}
          />
        </Stack>
      </YStack>
    </SafeAreaView>
  )
}
