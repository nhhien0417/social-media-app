import MessageOptionsSheet from './MessageOptionsSheet'
import { useState, useEffect, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { Text, XStack, YStack, useThemeName } from 'tamagui'
import { Message, MessageType } from '@/types/Message'
import { useChatStore } from '@/stores/chatStore'
import { getUserId } from '@/utils/SecureStore'

import { formatTime } from '@/utils/FormatTime'
import { getMediaTypeFromUrl } from '@/utils/MediaUtils'
import BubbleImage from './BubbleImage'
import BubbleVideo from './BubbleVideo'
import BubbleAudio from './BubbleAudio'
import BubbleFile from './BubbleFile'

const TEN_MINUTES_MS = 10 * 60 * 1000

interface MessageBubbleProps {
  chatId: string
  typingUsers?: string[]
}

export default function MessageBubble({
  chatId,
  typingUsers = [],
}: MessageBubbleProps) {
  const theme = useThemeName()
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(
    new Set()
  )

  const {
    messagesByChatId,
    paginationByChatId,
    fetchMessages,
    isLoading,
    deleteMessage,
  } = useChatStore()

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  )
  const [showOptions, setShowOptions] = useState(false)

  const handleDeleteMessage = async () => {
    if (selectedMessageId) {
      await deleteMessage(selectedMessageId)
      setShowOptions(false)
    }
  }

  const handleLongPress = (msgId: string) => {
    setSelectedMessageId(msgId)
    setShowOptions(true)
  }

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

      const renderAttachment = (url: string, index: number) => {
        const type = getMediaTypeFromUrl(url)
        const key = `${msg.id}-att-${index}`

        switch (type) {
          case MessageType.IMAGE:
            return <BubbleImage key={key} uri={url} />
          case MessageType.VIDEO:
            return <BubbleVideo key={key} uri={url} />
          case MessageType.AUDIO:
            return <BubbleAudio key={key} uri={url} />
          default:
            return <BubbleFile key={key} uri={url} name="File" />
        }
      }

      const attachments = msg.attachments || []

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
              onLongPress={() => handleLongPress(msg.id)}
              maxWidth="75%"
              borderRadius={15}
              backgroundColor={msg.content ? bubbleColor : 'transparent'}
              padding={msg.content ? '$3' : 0}
              gap="$2"
              pressStyle={msg.content ? { opacity: 0.85 } : undefined}
              cursor="pointer"
              overflow="hidden"
            >
              {/* Render Text Content */}
              {!!msg.content && (
                <Text color={isMe ? 'white' : '$color'}>{msg.content}</Text>
              )}

              {/* Render Attachments */}
              {attachments.map((url, i) => (
                <YStack key={i} borderRadius={10} overflow="hidden">
                  {renderAttachment(url, i)}
                </YStack>
              ))}
            </YStack>
          </XStack>

          {/* Status Message */}
          {msg.status && (
            <Text
              alignSelf={isMe ? 'flex-end' : 'flex-start'}
              fontSize="$1"
              color={msg.status === 'error' ? '$red10' : metaTextColor}
              paddingHorizontal="$2"
              marginTop="$-2"
            >
              {msg.status === 'sending'
                ? 'Sending...'
                : msg.status === 'sent'
                  ? 'Sent'
                  : 'Failed'}
            </Text>
          )}
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
        ListHeaderComponent={
          typingUsers.length > 0 ? (
            <XStack paddingHorizontal="$3" paddingVertical="$2">
              <YStack
                backgroundColor={theme === 'dark' ? '$gray8' : '$gray4'}
                borderRadius={15}
                paddingHorizontal="$3"
                paddingVertical="$2"
              >
                <Text fontSize="$2" color={metaTextColor}>
                  Typing...
                </Text>
              </YStack>
            </XStack>
          ) : null
        }
      />
      <MessageOptionsSheet
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onDelete={handleDeleteMessage}
      />
    </YStack>
  )
}
