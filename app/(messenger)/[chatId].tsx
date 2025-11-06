import { useLocalSearchParams } from 'expo-router'
import { YStack } from 'tamagui'
import MessageBubble from '@/features/messenger/components/MessageBubble'
import MessageInput from '@/features/messenger/components/MessageInput'

export default function ChatDetail() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>()

  return (
    <YStack
      flex={1}
      justifyContent="space-between"
      backgroundColor="$background"
    >
      <MessageBubble chatId={chatId} />
      <MessageInput chatId={chatId} />
    </YStack>
  )
}
