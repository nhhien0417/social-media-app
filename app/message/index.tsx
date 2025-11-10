import { YStack } from 'tamagui'
import ChatList from '@/features/messenger/components/ChatList'

export default function MessageHome() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <ChatList />
    </YStack>
  )
}
