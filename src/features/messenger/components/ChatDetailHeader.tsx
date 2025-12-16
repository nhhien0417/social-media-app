import { Avatar, AvatarFallback, AvatarImage, Text, XStack } from 'tamagui'
import { ChevronLeft, Phone, Video } from '@tamagui/lucide-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Pressable } from 'react-native'
import { mockChats } from '../data/mock'

export default function ChatDetailHeader() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  // 🔹 Get current chat data
  const chat = mockChats.find(c => c.id === id)

  const other = chat?.otherParticipant
  const name = other
    ? [other.firstName, other.lastName].filter(Boolean).join(' ') ||
      other.username
    : 'Unknown'
  const avatar = other?.avatarUrl

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingLeft="$2"
      paddingRight="$3"
      paddingVertical="$2"
      backgroundColor="$background"
    >
      {/* Back Button + Avatar + Name */}
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
          <ChevronLeft size={24} />
        </Pressable>

        <Avatar circular size="$3.5" marginLeft={-3}>
          <AvatarImage source={{ uri: avatar || undefined }} alt={name} />
          <AvatarFallback
            backgroundColor="$color5"
            borderRadius={999}
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={12} fontWeight="700">
              {name[0]?.toUpperCase() ?? 'C'}
            </Text>
          </AvatarFallback>
        </Avatar>

        <Text
          fontSize="$5"
          fontWeight="700"
          numberOfLines={1}
          ellipsizeMode="tail"
          maxWidth={160}
          flexShrink={1}
        >
          {name}
        </Text>
      </XStack>

      {/* Call Buttons */}
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
          style={({ pressed }) => ({
            padding: 0,
            margin: 0,
            minWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            opacity: pressed ? 0.5 : 1,
          })}
          android_ripple={{ color: '#00000010', borderless: true }}
        >
          <Phone size={20} />
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
          style={({ pressed }) => ({
            padding: 0,
            margin: 0,
            minWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            opacity: pressed ? 0.5 : 1,
          })}
          android_ripple={{ color: '#00000010', borderless: true }}
        >
          <Video size={23} />
        </Pressable>
      </XStack>
    </XStack>
  )
}
