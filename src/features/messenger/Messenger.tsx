import { FlatList } from 'react-native'
import { YStack } from 'tamagui'
import { useLocalSearchParams } from 'expo-router'
import MessageBubble from './components/MessageBubble'
import MessageInput from './components/MessageInput'
import ChatDetailHeader from './components/ChatDetailHeader'
import ChatListItem from './components/ChatListItem'
import ChatListHeader from './components/ChatListHeader'
import { mockChats } from './data/mock'

export function ChatList() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <ChatListHeader />
      <FlatList
        data={mockChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatListItem item={item} />}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  )
}

export function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      justifyContent="space-between"
    >
      <ChatDetailHeader />
      <MessageBubble chatId={id} />
      <MessageInput chatId={id} />
    </YStack>
  )
}
