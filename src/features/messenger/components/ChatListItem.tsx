import { Avatar, Text, XStack, YStack, Button } from 'tamagui'
import { useRouter } from 'expo-router'
import { Chat } from '@/types/Chat'
import { CURRENT_USER_ID } from '../data/mock'

interface ChatListItemProps {
  item: Chat
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default function ChatListItem({ item }: ChatListItemProps) {
  const router = useRouter()

  const other = item.otherParticipant
  const name =
    [other.firstName, other.lastName].filter(Boolean).join(' ') ||
    other.username
  const avatar = other.avatarUrl

  return (
    <Button
      unstyled
      pressStyle={{ backgroundColor: '$black3' }}
      onPress={() => router.push(`/message/${item.id}`)}
      borderWidth={0}
      outlineWidth={0}
      shadowOpacity={0}
      hoverStyle={{ backgroundColor: '$black3' }}
    >
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$3"
        paddingHorizontal="$3"
        gap="$3"
      >
        {/* Avatar + text */}
        <XStack alignItems="center" gap="$3" flex={1}>
          <Avatar circular size="$5">
            <Avatar.Image source={{ uri: avatar || undefined }} />
            <Avatar.Fallback backgroundColor="$gray5" />
          </Avatar>

          <YStack flex={1} alignItems="flex-start">
            <Text
              fontWeight="700"
              color="$color"
              numberOfLines={1}
              fontSize="$4"
            >
              {name}
            </Text>
            <Text
              color={item.unreadCount > 0 ? '$color' : '#888'}
              fontWeight={item.unreadCount > 0 ? '700' : '400'}
              numberOfLines={1}
              fontSize="$3"
              textAlign="left"
            >
              {item.lastMessageSenderId === 'me' ? 'You: ' : ''}
              {item.lastMessage}
            </Text>
          </YStack>
        </XStack>

        {/* Time + unread dot */}
        <YStack alignItems="flex-end" gap="$1" minWidth={55}>
          <Text fontSize="$2" color="#888">
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
      </XStack>
    </Button>
  )
}
