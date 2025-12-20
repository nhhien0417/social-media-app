import { useCallback, useRef } from 'react'
import {
  FlatList,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native'
import { YStack, Text } from 'tamagui'
import type { Notification } from '@/types/Notification'
import NotificationItem from './NotificationItem'

interface NotificationListProps {
  notifications: Notification[]
  isLoading: boolean
  isRefreshing: boolean
  hasNext: boolean
  onNotificationPress: (notification: Notification) => void
  onMorePress: (notification: Notification) => void
  onRefresh: () => void
  onLoadMore: () => void
}

export default function NotificationList({
  notifications,
  isLoading,
  isRefreshing,
  hasNext,
  onNotificationPress,
  onMorePress,
  onRefresh,
  onLoadMore,
}: NotificationListProps) {
  // Use ref to prevent multiple calls during async operation
  const isLoadingMoreRef = useRef(false)

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent

      const threshold = layoutMeasurement.height * 0.5
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - threshold

      if (
        isCloseToBottom &&
        hasNext &&
        !isLoading &&
        !isLoadingMoreRef.current
      ) {
        isLoadingMoreRef.current = true
        onLoadMore()
        setTimeout(() => {
          isLoadingMoreRef.current = false
        }, 500)
      }
    },
    [hasNext, isLoading, onLoadMore]
  )

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationItem
        notification={item}
        onPress={onNotificationPress}
        onMorePress={onMorePress}
      />
    ),
    [onNotificationPress, onMorePress]
  )

  const renderFooter = useCallback(() => {
    if (!isLoading || isRefreshing) return null
    return (
      <YStack alignItems="center" paddingVertical="$4">
        <ActivityIndicator size="small" />
      </YStack>
    )
  }, [isLoading, isRefreshing])

  const renderEmpty = useCallback(() => {
    if (isLoading) return null
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingVertical="$8"
      >
        <Text color="$colorSubtle" fontSize="$4">
          No notifications
        </Text>
      </YStack>
    )
  }, [isLoading])

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onScroll={handleScroll}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  )
}
