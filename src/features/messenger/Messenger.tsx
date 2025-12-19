import { FlatList } from 'react-native'
import { YStack, Spinner, Text } from 'tamagui'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import MessageBubble from './components/MessageBubble'
import MessageInput from './components/MessageInput'
import ChatDetailHeader from './components/ChatDetailHeader'
import ChatListItem from './components/ChatListItem'
import ChatListHeader from './components/ChatListHeader'
import { useChatStore } from '@/stores/chatStore'
import { useChatEvent } from '@/hooks/useChatWebSocket'
import { ChatMessageEvent } from '@/types/Chat'

export function ChatList() {
  const { chats, fetchChats, isLoading, isRefreshing, chatsPagination } =
    useChatStore()
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    fetchChats(true).finally(() => setIsFirstLoad(false))
  }, [])

  const handleLoadMore = () => {
    if (chatsPagination.hasNext && !isLoading) {
      fetchChats(false)
    }
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ChatListHeader />
      {isFirstLoad || (isLoading && chats.length === 0) ? (
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
  const {
    fetchChatDetail,
    fetchMessages,
    clearCurrentChat,
    markAsRead,
    receiveNewMessage,
    receiveMessageRead,
    setTypingStatus,
    typingByChatId,
  } = useChatStore()

  // Listen for message events specific to this chat
  useChatEvent<ChatMessageEvent>(
    'message',
    useCallback(
      event => {
        if (event.chatId !== id) return

        switch (event.eventType) {
          case 'NEW_MESSAGE':
            receiveNewMessage(event)
            break
          case 'MESSAGE_READ':
            receiveMessageRead(event)
            break
        }
      },
      [id, receiveNewMessage, receiveMessageRead]
    )
  )

  // Listen for typing events
  useChatEvent<ChatMessageEvent>(
    'typing',
    useCallback(
      event => {
        if (event.chatId !== id || !event.sender?.id) return
        const isTyping = event.content === 'TYPING_START'
        setTypingStatus(id, event.sender.id, isTyping)
      },
      [id, setTypingStatus]
    )
  )

  useEffect(() => {
    if (id) {
      fetchChatDetail(id)
      fetchMessages(id, true)
      markAsRead(id)
    }
    return () => {
      clearCurrentChat()
    }
  }, [id])

  const typingUsers = typingByChatId[id] || []

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      justifyContent="space-between"
    >
      <ChatDetailHeader />
      <MessageBubble chatId={id} typingUsers={typingUsers} />
      <MessageInput chatId={id} />
    </YStack>
  )
}
