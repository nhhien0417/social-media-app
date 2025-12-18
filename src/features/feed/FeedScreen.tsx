import { FlatList, StyleSheet, BackHandler, RefreshControl } from 'react-native'
import { YStack, XStack, Text, Separator, Spinner } from 'tamagui'
import { Send, Moon, Sun } from '@tamagui/lucide-icons'
import { Image } from 'react-native'
import { useEffect, useCallback } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  Easing,
} from 'react-native-reanimated'

import StoryBar from './components/StoryBar'
import PostCard from './components/PostCard'
import PostingStatus from './components/PostingStatus'
import { usePostStore } from '@/stores/postStore'
import ButtonIcon from '@/components/IconButton'
import { router } from 'expo-router'
import { useSeenTracking } from '@/hooks/useSeenTracking'

const HEADER_VIEW_HEIGHT = 50
const AnimatedHeader = Animated.createAnimatedComponent(
  XStack
) as unknown as typeof XStack
const AnimatedSpacer = Animated.View
const AnimatedList = Animated.createAnimatedComponent(
  FlatList
) as unknown as typeof FlatList

function HeaderContent() {
  return (
    <XStack
      paddingHorizontal="$3"
      height={HEADER_VIEW_HEIGHT}
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="$background"
      width="100%"
    >
      <XStack alignItems="center" justifyContent="space-between" gap={10}>
        <Image
          source={require('@/assets/logo_0.png')}
          style={{ width: 25, height: 25 }}
        />
        <Text fontFamily="$heading" fontSize={25} fontWeight="600">
          Hearty
        </Text>
      </XStack>
      <ButtonIcon Icon={Send} onPress={() => router.push('/message')} />
    </XStack>
  )
}

export default function FeedScreen() {
  const TOTAL_HEADER_HEIGHT = HEADER_VIEW_HEIGHT + 2

  const offset = useSharedValue(0)
  const lastY = useSharedValue(0)
  const { trackSeen, cancelTracking } = useSeenTracking()

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        BackHandler.exitApp()
        return true
      }
    )

    return () => backHandler.remove()
  }, [])

  const {
    posts,
    stories,
    isLoading,
    isRefreshing,
    fetchPosts,
    refreshPosts,
    fetchStories,
    refreshStories,
  } = usePostStore()

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts()
    }

    if (stories.length === 0) {
      fetchStories()
    }
  }, [])

  const onRefresh = useCallback(() => {
    refreshPosts()
    refreshStories()
  }, [])

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      const y = e.contentOffset.y

      if (y < 0) {
        offset.value = 0
        lastY.value = 0
        return
      }
      const dy = y - lastY.value

      if (dy > 0) {
        offset.value = Math.min(TOTAL_HEADER_HEIGHT, offset.value + dy)
      } else if (dy < 0) {
        if (y < TOTAL_HEADER_HEIGHT) {
          offset.value = Math.max(0, offset.value + dy)
        } else if (dy < -5) {
          offset.value = Math.max(0, offset.value + dy)
        }
      }
      lastY.value = y
    },
  })

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(-offset.value, {
          duration: 150,
          easing: Easing.out(Easing.quad),
        }),
      },
    ],
  }))

  const spacerStyle = useAnimatedStyle(() => ({
    height: withTiming(TOTAL_HEADER_HEIGHT - offset.value, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    }),
  }))

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      viewableItems.forEach((item: any) => {
        if (item.isViewable && item.item?.id) {
          trackSeen(item.item.id)
        } else if (!item.isViewable && item.item?.id) {
          cancelTracking(item.item.id)
        }
      })
    },
    [trackSeen, cancelTracking]
  )

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <AnimatedHeader
        style={headerStyle}
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderColor="$borderColor"
        backgroundColor="$background"
      >
        <HeaderContent />
      </AnimatedHeader>

      <AnimatedList
        data={posts}
        keyExtractor={item => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListHeaderComponent={
          <>
            <AnimatedSpacer style={spacerStyle} />
            <StoryBar stories={stories} />
            <PostingStatus />
            <Separator />
          </>
        }
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <YStack padding="$4" alignItems="center">
              <Spinner size="large" color="$color" />
            </YStack>
          ) : null
        }
      />
    </YStack>
  )
}
