import { FlatList } from 'react-native'
import { YStack, Spinner, Text } from 'tamagui'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import MessageBubble from './components/MessageBubble'
import MessageInput from './components/MessageInput'
import ChatDetailHeader from './components/ChatDetailHeader'
import ChatListItem from './components/ChatListItem'
import ChatListHeader from './components/ChatListHeader'
import { useChatStore } from '@/stores/chatStore'

export function ChatList() {
  const { chats, fetchChats, isLoading, isRefreshing, chatsPagination } =
    useChatStore()

  useEffect(() => {
    fetchChats(true)
  }, [])

  const handleLoadMore = () => {
    if (chatsPagination.hasNext && !isLoading) {
      fetchChats(false)
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ChatListHeader />
      {isLoading && chats.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color" />
        </YStack>
      ) : chats.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text color="$color">No chats yet</Text>
        </YStack>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatListItem item={item} />}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => fetchChats(true)}
          refreshing={isRefreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </YStack>
  )
}

export function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { fetchChatDetail, fetchMessages, clearCurrentChat } = useChatStore()

  useEffect(() => {
    if (id) {
      fetchChatDetail(id)
      fetchMessages(id, true)
    }
    return () => {
      clearCurrentChat()
    }
  }, [id])

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
