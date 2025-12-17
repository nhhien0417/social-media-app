import { Text, XStack, YStack } from 'tamagui'
import { ChevronLeft, Phone, Video } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { useChatStore } from '@/stores/chatStore'
import Avatar from '@/components/Avatar'
import { useLocalSearchParams } from 'expo-router'

export default function ChatDetailHeader() {
  const router = useRouter()
  const params = useLocalSearchParams<{ id?: string }>()
  const { currentChat: chat, chats, onlineUsers } = useChatStore()

  const fromStore = chat?.otherParticipant
  const fromList = chats.find(c => c.id === params.id)?.otherParticipant

  const name = fromStore?.username || fromList?.username
  const avatar = fromStore?.avatarUrl || fromList?.avatarUrl
  const id = chat?.id || params.id
  const otherUserId = fromStore?.id || fromList?.id

  const isOnline = otherUserId ? onlineUsers.has(otherUserId) : false

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingLeft="$2"
      paddingRight="$3"
      paddingVertical="$2"
      backgroundColor="$background"
    >
      <XStack alignItems="center" gap="$2">
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back()
            } else {
              router.replace('/message')
            }
          }}
        >
          <ChevronLeft size={22} color="$color" />
        </Pressable>

        <Avatar size={45} uri={avatar || undefined} />

        <YStack flexShrink={1}>
          <Text
            fontSize="$5"
            fontWeight="700"
            numberOfLines={1}
            ellipsizeMode="tail"
            maxWidth={200}
          >
            {name}
          </Text>
          <Text fontSize="$2" color={isOnline ? '$green10' : '$gray10'}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </YStack>
      </XStack>

      <XStack gap="$4">
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/call/[id]',
              params: {
                id: id || '1',
                type: 'voice',
                name: name,
                avatar: avatar || '',
                chatId: id || '1',
              },
            })
          }}
        >
          <Phone size={20} color="$color" />
        </Pressable>
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/call/[id]',
              params: {
                id: id || '1',
                type: 'video',
                name: name || 'Unknown',
                avatar: avatar || '',
                chatId: id || '1',
              },
            })
          }}
        >
          <Video size={23} color="$color" />
        </Pressable>
      </XStack>
    </XStack>
  )
}
