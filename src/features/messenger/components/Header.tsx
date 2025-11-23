import { Avatar, AvatarFallback, AvatarImage, Text, XStack } from 'tamagui'
import { ChevronLeft, PenSquare, Phone, Video } from '@tamagui/lucide-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Pressable } from 'react-native'

const mockChats = [
  {
    id: '1',
    name: 'Tìm Bạn Chơi Game Valorant',
    avatar: 'https://i.imgur.com/zYIlgBl.png',
  },
  {
    id: '2',
    name: 'Colong Tiếng Trung TP Tây...',
    avatar: 'https://i.imgur.com/pqQZ4aW.png',
  },
  {
    id: '3',
    name: 'DDD',
    avatar: 'https://i.imgur.com/yYgU8xq.png',
  },
  {
    id: '4',
    name: 'Hiền ZZZ',
    avatar: 'https://i.imgur.com/zE6kZ3E.png',
  },
  {
    id: '5',
    name: 'Motadog',
    avatar: 'https://i.imgur.com/zG3nQ1E.png',
  },
  {
    id: '6',
    name: 'Nghiện Đồ Án',
    avatar: 'https://i.imgur.com/D4xXj2b.png',
  },
]

export default function MessengerHeader({ type }: { type: 'list' | 'detail' }) {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  if (type === 'detail') {
    // 🔹 Lấy dữ liệu chat hiện tại
    const chat = mockChats.find(c => c.id === id)

    return (
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingLeft="$2"
        paddingRight="$3"
        paddingVertical="$2"
        backgroundColor="$background"
      >
        {/* Nút Back + Avatar + Tên */}
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
            <AvatarImage
              source={chat?.avatar ? { uri: chat.avatar } : undefined}
              alt={chat?.name ?? 'Chat avatar'}
            />
            <AvatarFallback
              backgroundColor="$color5"
              borderRadius={999}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={12} fontWeight="700">
                {chat?.name?.[0]?.toUpperCase() ?? 'C'}
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
            {chat?.name ?? 'Đoạn chat cực kì dàiiiiiiiiii'}
          </Text>
        </XStack>

        {/* Nút Gọi */}
        <XStack gap="$4">
          <Pressable
            onPress={() => {
              router.push({
                pathname: '/call/[id]',
                params: {
                  id: id || '1',
                  type: 'voice',
                  name: chat?.name || 'Unknown',
                  avatar: chat?.avatar || '',
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
                  name: chat?.name || 'Unknown',
                  avatar: chat?.avatar || '',
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

  // 🔹 Header mặc định (trang danh sách)
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$4"
      paddingVertical="$3"
      backgroundColor="$background"
    >
      <XStack alignItems="center" gap="$3">
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back()
            } else {
              router.replace('/message')
            }
          }}
          style={({ pressed }) => ({
            padding: 0,
            margin: 0,
            minWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            opacity: pressed ? 0.5 : 1, // hiệu ứng nhấn nhẹ
          })}
          android_ripple={{ color: '#00000010', borderless: true }}
        >
          <ChevronLeft size={22} color="$color" />
        </Pressable>

        <Text fontSize="$6" fontWeight="700">
          Chats
        </Text>
      </XStack>

      <Pressable
        style={({ pressed }) => ({
          padding: 0,
          margin: 0,
          minWidth: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          opacity: pressed ? 0.5 : 1, // hiệu ứng nhấn nhẹ
        })}
        android_ripple={{ color: '#00000010', borderless: true }}
      >
        <PenSquare size={20} />
      </Pressable>
    </XStack>
  )
}
