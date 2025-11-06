import { XStack, Text, Image } from 'tamagui'
import { ChevronLeft, PenSquare, Phone } from '@tamagui/lucide-icons'
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
  const { chatId } = useLocalSearchParams<{ chatId: string }>()

  if (type === 'detail') {
    // 🔹 Lấy dữ liệu chat hiện tại
    const chat = mockChats.find(c => c.id === chatId)

    return (
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        paddingVertical="$3"
        backgroundColor="$background"
      >
        {/* Nút Back + Avatar + Tên */}
        <XStack alignItems="center" gap="$3">
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={22} />
          </Pressable>

          {chat && (
            <>
              <Image
                source={{ uri: chat.avatar }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
              <Text fontSize="$5" fontWeight="700" numberOfLines={1}>
                {chat.name}
              </Text>
            </>
          )}
        </XStack>

        {/* Nút Gọi */}
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
          <Phone size={20} />
        </Pressable>
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
          onPress={() => router.back()}
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
          <ChevronLeft size={22} color="#000" />
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
