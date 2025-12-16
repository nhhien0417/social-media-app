import { Text, XStack } from 'tamagui'
import { ChevronLeft, Phone, Video } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { useChatStore } from '@/stores/chatStore'
import Avatar from '@/components/Avatar'

export default function ChatDetailHeader() {
  const router = useRouter()
  const { currentChat: chat } = useChatStore()

  const other = chat?.otherParticipant
  const name = other?.username || 'Unknown'
  const avatar = other?.avatarUrl
  const id = chat?.id

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

        <Text
          fontSize="$5"
          fontWeight="700"
          numberOfLines={1}
          ellipsizeMode="tail"
          maxWidth={200}
          flexShrink={1}
        >
          {name}
        </Text>
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
