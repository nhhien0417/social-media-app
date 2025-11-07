import { useState } from 'react'
import { Text, XStack, YStack, useThemeName } from 'tamagui'

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
  {
    id: '1',
    text: 'Hey, how are you?',
    senderId: 'u1',
    isMe: false,
    createdAt: '2025-11-07T08:00:00.000Z',
  },
  {
    id: '2',
    text: 'I’m good, you?',
    senderId: 'u2',
    isMe: true,
    createdAt: '2025-11-07T08:03:00.000Z',
    status: 'sent',
  },
  {
    id: '3',
    text: 'Still up for coffee later today?',
    senderId: 'u1',
    isMe: false,
    createdAt: '2025-11-07T08:18:30.000Z',
  },
  {
    id: '4',
    text: 'Absolutely, see you at 5!',
    senderId: 'u2',
    isMe: true,
    createdAt: '2025-11-07T08:20:00.000Z',
    status: 'seen',
  },
]

const TEN_MINUTES_MS = 10 * 60 * 1000

const formatTimestamp = (value?: string) => {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''

  const formatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    ...(parsed.getFullYear() !== new Date().getFullYear()
      ? { year: 'numeric' as const }
      : {}),
    hourCycle: 'h23',
  })

  return formatter.format(parsed)
}

export default function MessageBubble({ chatId }: MessageBubbleProps) {
  const theme = useThemeName()
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>()

  const messages = mockMessages
  const lastOutgoingMessageId = [...messages]
    .reverse()
    .find(msg => msg.isMe)?.id

  const metaTextColor =
    theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)'

  const toggleTimestamp = (messageId: string) => {
    setExpandedMessages(prev => {
      const next = new Set(prev ?? [])
      if (next.has(messageId)) {
        next.delete(messageId)
      } else {
        next.add(messageId)
      }
      return next
    })
  }

  return (
    <YStack flex={1} padding="$3" gap="$3">
      {messages.map((msg, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : undefined

        const hasLongGap = (() => {
          if (!previousMessage?.createdAt || !msg.createdAt) return false
          return (
            new Date(msg.createdAt).getTime() -
              new Date(previousMessage.createdAt).getTime() >
            TEN_MINUTES_MS
          )
        })()

        const timestampLabel = formatTimestamp(msg.createdAt)
        const shouldForceTimestamp = index === 0 || hasLongGap
        const isExpanded = expandedMessages?.has(msg.id) ?? false
        const showTimestamp =
          Boolean(timestampLabel) && (shouldForceTimestamp || isExpanded)
        const isLastOutgoing = msg.id === lastOutgoingMessageId

        const bubbleColor = msg.isMe
          ? theme === 'dark'
            ? '$blue10'
            : '$blue8'
          : theme === 'dark'
            ? '$green8'
            : '$green4'

        return (
          <YStack key={msg.id} gap="$1">
            {showTimestamp && (
              <Text alignSelf="center" fontSize="$2" color={metaTextColor}>
                {timestampLabel}
              </Text>
            )}

            <XStack justifyContent={msg.isMe ? 'flex-end' : 'flex-start'}>
              <YStack
                onPress={
                  timestampLabel ? () => toggleTimestamp(msg.id) : undefined
                }
                maxWidth="75%"
                padding="$3"
                borderRadius={16}
                backgroundColor={bubbleColor}
                pressStyle={{ opacity: 0.85 }}
                cursor={timestampLabel ? 'pointer' : 'default'}
                hoverStyle={timestampLabel ? { opacity: 0.92 } : undefined}
              >
                <Text color={msg.isMe ? 'white' : '$color'}>{msg.text}</Text>
              </YStack>
            </XStack>

            {isLastOutgoing && (
              <Text alignSelf="flex-end" fontSize="$2" color={metaTextColor}>
                {(msg.status ?? 'sent').toLowerCase() === 'seen'
                  ? 'Seen'
                  : 'Sent'}
              </Text>
            )}
          </YStack>
        )
      })}
    </YStack>
  )
}
