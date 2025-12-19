import { Text, XStack, YStack } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
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
      <XStack alignItems="center">
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

        <YStack marginHorizontal="$2" position="relative">
          <Avatar size={50} uri={avatar || undefined} />
          {isOnline && (
            <YStack
              position="absolute"
              bottom={0}
              right={0}
              width={15}
              height={15}
              backgroundColor="#22C55E"
              borderRadius={10}
              borderWidth={2}
              borderColor="$background"
            />
          )}
        </YStack>

        <YStack marginHorizontal="$2" flexShrink={1}>
          <Text
            fontSize="$6"
            fontWeight="700"
            numberOfLines={1}
            ellipsizeMode="tail"
            maxWidth={200}
          >
            {name}
          </Text>
          {isOnline ? (
            <Text fontSize="$2" color="#22C55E" fontWeight="500">
              Active now
            </Text>
          ) : (
            <Text fontSize="$2" color="#65676B">
              Offline
            </Text>
          )}
        </YStack>
      </XStack>
      {/* 
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
      </XStack> */}
    </XStack>
  )
}
