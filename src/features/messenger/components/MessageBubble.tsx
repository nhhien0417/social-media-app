import { useState } from 'react'
import { Text, XStack, YStack, useThemeName } from 'tamagui'
import { CURRENT_USER_ID, mockMessages } from '../data/mock'
import { Message } from '@/types/Message'

interface MessageBubbleProps {
  chatId: string
  message?: Message
}

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

  // In real app, filter by chatId
  const messages = mockMessages.filter((m: Message) => m.chatId === chatId)

  // If no messages found for this chat in mock, just show all for demo purposes
  // or show empty. Let's show all if filter is empty to keep demo working if ids don't match perfect
  const displayMessages = messages.length > 0 ? messages : mockMessages

  const lastOutgoingMessageId = [...displayMessages]
    .reverse()
    .find(msg => msg.senderId === CURRENT_USER_ID)?.id

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
      {displayMessages.map((msg, index) => {
        const previousMessage =
          index > 0 ? displayMessages[index - 1] : undefined

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
        const isMe = msg.senderId === CURRENT_USER_ID

        const bubbleColor = isMe
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

            <XStack justifyContent={isMe ? 'flex-end' : 'flex-start'}>
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
                <Text color={isMe ? 'white' : '$color'}>{msg.content}</Text>
              </YStack>
            </XStack>
          </YStack>
        )
      })}
    </YStack>
  )
}
