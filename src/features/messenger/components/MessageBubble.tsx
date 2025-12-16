import { useState, useEffect, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { Text, XStack, YStack, useThemeName } from 'tamagui'
import { Message } from '@/types/Message'
import { useChatStore } from '@/stores/chatStore'
import { getUserId } from '@/utils/SecureStore'

import { formatTime } from '@/utils/FormatTime'
const TEN_MINUTES_MS = 10 * 60 * 1000

export default function MessageBubble({ chatId }: { chatId: string }) {
  const theme = useThemeName()
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(
    new Set()
  )

  const { messagesByChatId, paginationByChatId, fetchMessages, isLoading } =
    useChatStore()

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    getUserId().then(setCurrentUserId)
  }, [])

  const messages = messagesByChatId[chatId] || []
  const pagination = paginationByChatId[chatId] || { hasNext: false }

  const onEndReached = () => {
    if (!pagination.hasNext || isLoading) return
    fetchMessages(chatId, false)
  }

  const displayMessages = messages
  const metaTextColor =
    theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.45)'

  const toggleTimestamp = (messageId: string) => {
    setExpandedMessages(prev => {
      const next = new Set(prev)
      if (next.has(messageId)) {
        next.delete(messageId)
      } else {
        next.add(messageId)
      }
      return next
    })
  }

  const renderItem: ListRenderItem<Message> = useCallback(
    ({ item: msg, index }) => {
      const previousMessage = displayMessages[index + 1]

      const hasLongGap = (() => {
        if (!previousMessage?.createdAt || !msg.createdAt) return false
        return (
          new Date(msg.createdAt).getTime() -
            new Date(previousMessage.createdAt).getTime() >
          TEN_MINUTES_MS
        )
      })()

      const timestampLabel = formatTime(msg.createdAt)
      const shouldForceTimestamp =
        hasLongGap || index === displayMessages.length - 1

      const isExpanded = expandedMessages.has(msg.id)
      const isMe = currentUserId && msg.senderId === currentUserId

      const bubbleColor = isMe
        ? theme === 'dark'
          ? '$blue10'
          : '$blue8'
        : theme === 'dark'
          ? '$green8'
          : '$green4'

      return (
        <YStack key={msg.id} gap="$3" paddingVertical="$1.5">
          {(shouldForceTimestamp || isExpanded) && timestampLabel ? (
            <Text
              alignSelf="center"
              fontSize="$2"
              color={metaTextColor}
              marginTop="$3"
            >
              {timestampLabel}
            </Text>
          ) : null}

          <XStack justifyContent={isMe ? 'flex-end' : 'flex-start'}>
            <YStack
              onPress={() => toggleTimestamp(msg.id)}
              maxWidth="75%"
              padding="$3"
              borderRadius={15}
              backgroundColor={bubbleColor}
              pressStyle={{ opacity: 0.85 }}
              cursor="pointer"
            >
              <Text color={isMe ? 'white' : '$color'}>{msg.content}</Text>
            </YStack>
          </XStack>
        </YStack>
      )
    },
    [displayMessages, expandedMessages, currentUserId, metaTextColor, theme]
  )

  return (
    <YStack flex={1}>
      <FlatList
        inverted
        data={displayMessages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  )
}
