import { Text, XStack, YStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { Chat } from '@/types/Chat'
import { useState, useEffect } from 'react'
import { getUserId } from '@/utils/SecureStore'
import { Pressable } from 'react-native'
import { formatTime } from '@/utils/FormatTime'
import Avatar from '@/components/Avatar'
import { MoreVertical } from '@tamagui/lucide-icons'
import ChatOptionsSheet from './ChatOptionsSheet'
import { useChatStore } from '@/stores/chatStore'

interface ChatListItemProps {
  item: Chat
}

export default function ChatListItem({ item }: ChatListItemProps) {
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const { deleteChat, markAsRead } = useChatStore()

  useEffect(() => {
    getUserId().then(setCurrentUserId)
  }, [])

  const handleDelete = async () => {
    try {
      await deleteChat(item.id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(item.id)
    } catch (error) {
      console.error(error)
    }
  }

  const other = item.otherParticipant
  const name = other?.username || 'Unknown'
  const avatar = other?.avatarUrl

  return (
    <>
      <Pressable
        onPress={() => router.push(`/message/${item.id}`)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          backgroundColor: 'transparent',
        })}
      >
        <XStack padding="$3" alignItems="center" gap="$3">
          <XStack alignItems="center" gap="$3" flex={1}>
            <Avatar size={50} uri={avatar || undefined} />

            <YStack flex={1} alignItems="flex-start">
              <Text fontWeight="700" fontSize="$4" color="$color">
                {name}
              </Text>
              <Text
                color={item.unreadCount > 0 ? '$color' : '#888'}
                fontWeight={item.unreadCount > 0 ? '700' : '400'}
                numberOfLines={1}
                fontSize="$3"
                textAlign="left"
              >
                {currentUserId && item.lastMessageSenderId === currentUserId
                  ? 'You: '
                  : ''}
                {item.lastMessage}
              </Text>
            </YStack>
          </XStack>

          <YStack alignItems="flex-end" gap="$1">
            <Text color="#888" fontSize="$2">
              {formatTime(item.lastMessageTime)}
            </Text>
            {item.unreadCount > 0 && (
              <YStack
                width={9}
                height={9}
                borderRadius={99}
                backgroundColor="$blue10"
              />
            )}
          </YStack>

          <Pressable
            onPress={e => {
              e.stopPropagation()
              setShowOptions(true)
            }}
            hitSlop={10}
          >
            <YStack padding="$2">
              <MoreVertical size={20} color="$color8" />
            </YStack>
          </Pressable>
        </XStack>
      </Pressable>

      <ChatOptionsSheet
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onDelete={handleDelete}
        onMarkAsRead={handleMarkAsRead}
      />
    </>
  )
}
