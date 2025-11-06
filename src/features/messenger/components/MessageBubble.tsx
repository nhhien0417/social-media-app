import { XStack, YStack, Text, useThemeName } from 'tamagui'

interface MessageBubbleProps {
  chatId: string
  message?: {
    id: string
    text: string
    senderId: string
    isMe?: boolean
    createdAt?: string
  }
}

// demo tạm thời, mày có thể truyền data thật sau
const mockMessages = [
  { id: '1', text: 'Hey, how are you?', senderId: 'u1', isMe: false },
  { id: '2', text: 'I’m good, you?', senderId: 'u2', isMe: true },
  { id: '3', text: 'Wanna grab coffee?', senderId: 'u1', isMe: false },
]

export default function MessageBubble({ chatId }: MessageBubbleProps) {
  const theme = useThemeName()

  return (
    <YStack flex={1} padding="$3" gap="$2">
      {mockMessages.map(msg => (
        <XStack
          key={msg.id}
          justifyContent={msg.isMe ? 'flex-end' : 'flex-start'}
        >
          <YStack
            maxWidth="75%"
            padding="$3"
            borderRadius={16}
            backgroundColor={
              msg.isMe
                ? theme === 'dark'
                  ? '$blue10'
                  : '$blue8'
                : theme === 'dark'
                  ? '$green8'
                  : '$green4'
            }
          >
            <Text color={msg.isMe ? 'white' : '$color'}>{msg.text}</Text>
          </YStack>
        </XStack>
      ))}
    </YStack>
  )
}
