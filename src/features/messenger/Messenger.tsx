import {
  ScrollView,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { YStack, Spinner, Text } from 'tamagui'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState, useCallback } from 'react'
import MessageBubble from './components/MessageBubble'
import MessageInput from './components/MessageInput'
import ChatDetailHeader from './components/ChatDetailHeader'
import ChatListItem from './components/ChatListItem'
import ChatListHeader from './components/ChatListHeader'
import OnlineFriendsBar from './components/OnlineFriendsBar'
import { useChatStore } from '@/stores/chatStore'
import { useProfileStore } from '@/stores/profileStore'
import { useChatEvent } from '@/hooks/useChatWebSocket'
import { ChatMessageEvent } from '@/types/Chat'

export function ChatList() {
  const {
    chats,
    isLoading,
    isRefreshing,
    chatsPagination,
    fetchChats,
    fetchOnlineFriends,
  } = useChatStore()
  const { fetchFriends, initialize } = useProfileStore()
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await initialize()
      fetchFriends()
      fetchOnlineFriends()
      fetchChats(true).finally(() => setIsFirstLoad(false))
    }
    loadData()
  }, [])

  const handleRefresh = () => {
    fetchChats(true)
    fetchFriends()
    fetchOnlineFriends()
  }

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent

      const threshold = layoutMeasurement.height * 0.5
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - threshold

      if (isCloseToBottom && !isLoading && chatsPagination.hasNext) {
        fetchChats(false)
      }
    },
    [isLoading, chatsPagination, fetchChats]
  )

  // Loading state
  if (isFirstLoad) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <ChatListHeader />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$color" />
        </YStack>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ChatListHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <OnlineFriendsBar />
        {chats.length === 0 ? (
          <YStack paddingVertical="$10" alignItems="center">
            <Text color="$color">No chats yet</Text>
          </YStack>
        ) : (
          chats.map(chat => <ChatListItem key={chat.id} item={chat} />)
        )}
      </ScrollView>
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
  useChatEvent<ChatMessageEvent>('message', event => {
    if (event.chatId !== id) return

    switch (event.eventType) {
      case 'NEW_MESSAGE':
        receiveNewMessage(event)
        markAsRead(id)
        break
      case 'MESSAGE_READ':
        receiveMessageRead(event)
        break
    }
  })

  // Listen for typing events
  useChatEvent<ChatMessageEvent>('typing', event => {
    if (event.chatId !== id || !event.senderId) return
    const isTyping = event.content === 'TYPING_START'
    setTypingStatus(id, event.senderId, isTyping)
  })

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
