import { View, Text } from 'react-native'
import { YStack } from 'tamagui'
export default function Screen() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
    >
      <Text>Create Screen</Text>
    </YStack>
  )
}
