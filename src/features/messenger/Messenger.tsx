import { YStack, XStack, Text, Avatar, ScrollView, Button } from 'tamagui'
import { useRouter } from 'expo-router'
import StoryBar from '@/features/feed/components/StoryBar'

const mockChats = [
  {
    id: '1',
    name: 'Tìm Bạn Chơi Game Valorant',
    message: 'Tìm bạn chơi game val...',
    time: '8:34 pm',
    unread: true,
    avatar: 'https://i.imgur.com/zYIlgBl.png',
  },
  {
    id: '2',
    name: 'Colong Tiếng Trung TP Tây...',
    message: '2 new messages',
    time: '7:37 pm',
    unread: true,
    avatar: 'https://i.imgur.com/pqQZ4aW.png',
  },
  {
    id: '3',
    name: 'DDD',
    message: 'mình nghe đc giọng bạn lu...',
    time: '6:02 pm',
    unread: false,
    avatar: 'https://i.imgur.com/yYgU8xq.png',
  },
  {
    id: '4',
    name: 'Hiền ZZZ',
    message: 'hay v',
    time: '2:22 pm',
    unread: false,
    avatar: 'https://i.imgur.com/zE6kZ3E.png',
  },
  {
    id: '5',
    name: 'Motadog',
    message: 'You: quá khó',
    time: '2:05 pm',
    unread: false,
    avatar: 'https://i.imgur.com/zG3nQ1E.png',
  },
  {
    id: '6',
    name: 'Nghiện Đồ Án',
    message: 'Tralalero Tralala: từ từ miế...',
    time: '12:34 pm',
    unread: false,
    avatar: 'https://i.imgur.com/D4xXj2b.png',
  },
]

export default function ChatList() {
  const router = useRouter()

  return (
    <YStack backgroundColor="$background">
      <StoryBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical
        bounces
      >
        {mockChats.map(item => (
          <Button
            key={item.id}
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
                  <Avatar.Image source={{ uri: item.avatar }} />
                  <Avatar.Fallback backgroundColor="$gray5" />
                </Avatar>

                <YStack flex={1} alignItems="flex-start">
                  <Text
                    fontWeight="700"
                    color="$color"
                    numberOfLines={1}
                    fontSize="$4"
                  >
                    {item.name}
                  </Text>
                  <Text
                    color="#888"
                    numberOfLines={1}
                    fontSize="$3"
                    textAlign="left"
                  >
                    {item.message}
                  </Text>
                </YStack>
              </XStack>

              {/* Thời gian + chấm unread */}
              <YStack alignItems="flex-end" gap="$1" minWidth={55}>
                <Text fontSize="$2" color="#888">
                  {item.time}
                </Text>
                {item.unread && (
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
        ))}
      </ScrollView>
    </YStack>
  )
}
