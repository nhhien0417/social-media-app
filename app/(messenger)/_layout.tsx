import MessengerHeader from '@/features/messenger/components/Header'
import { Stack } from 'expo-router'
import { YStack } from 'tamagui'

export default function MessengerLayout() {
  return (
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
  )
}
