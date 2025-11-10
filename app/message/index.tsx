import { YStack } from 'tamagui'
import Messenger from '@/features/messenger/Messenger'

export default function MessageHome() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Messenger />
    </YStack>
  )
}
