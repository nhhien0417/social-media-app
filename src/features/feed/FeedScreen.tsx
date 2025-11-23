import {
  FlatList,
  StyleSheet,
  BackHandler,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { YStack, XStack, Text, Separator, Spinner } from 'tamagui'
import { Send, Moon, Sun } from '@tamagui/lucide-icons'
import { Image } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
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
import ButtonIcon from '@/components/IconButton'
import { useAppTheme } from '@/providers/ThemeProvider'
import { router } from 'expo-router'
import { usePostStore } from '@/stores/postStore'

const HEADER_VIEW_HEIGHT = 50
const AnimatedHeader = Animated.createAnimatedComponent(
  XStack
) as unknown as typeof XStack
const AnimatedSpacer = Animated.View
const AnimatedList = Animated.createAnimatedComponent(
  FlatList
) as unknown as typeof FlatList

function HeaderContent() {
  const { theme, toggleTheme } = useAppTheme()

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
          Valorant
        </Text>
      </XStack>
      <XStack alignItems="center" justifyContent="space-between">
        <ButtonIcon Icon={Send} onPress={() => router.push('/message')} />
        <ButtonIcon
          Icon={theme === 'light' ? Moon : Sun}
          onPress={toggleTheme}
        />
      </XStack>
    </XStack>
  )
}

export default function FeedScreen() {
  const TOTAL_HEADER_HEIGHT = HEADER_VIEW_HEIGHT + 2

  const offset = useSharedValue(0)
  const lastY = useSharedValue(0)
  const [refreshing, setRefreshing] = useState(false)

  const { posts, loading, error, fetchFeed, refreshFeed, clearError } =
    usePostStore()

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshFeed()
    setRefreshing(false)
  }, [refreshFeed])

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

  // Loading initial state
  if (loading && (!posts || posts.length === 0)) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <XStack
          paddingHorizontal="$3"
          height={HEADER_VIEW_HEIGHT}
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="$background"
          borderBottomWidth={StyleSheet.hairlineWidth}
          borderColor="$borderColor"
        >
          <HeaderContent />
        </XStack>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$primary" />
          <Text marginTop="$3" color="$color" opacity={0.6}>
            Loading feed...
          </Text>
        </YStack>
      </YStack>
    )
  }

  // Error state
  if (error && (!posts || posts.length === 0)) {
    return (
      <YStack flex={1} backgroundColor="$background">
        <XStack
          paddingHorizontal="$3"
          height={HEADER_VIEW_HEIGHT}
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="$background"
          borderBottomWidth={StyleSheet.hairlineWidth}
          borderColor="$borderColor"
        >
          <HeaderContent />
        </XStack>
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$4"
        >
          <Text fontSize={16} color="$red10" marginBottom="$3">
            Failed to load feed
          </Text>
          <Text
            fontSize={14}
            color="$color"
            opacity={0.6}
            marginBottom="$4"
            textAlign="center"
          >
            {error}
          </Text>
          <Text
            fontSize={14}
            color="$primary"
            fontWeight="600"
            onPress={() => {
              clearError()
              fetchFeed()
            }}
          >
            Try Again
          </Text>
        </YStack>
      </YStack>
    )
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
        data={posts || []}
        keyExtractor={item => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#999"
            progressViewOffset={TOTAL_HEADER_HEIGHT}
          />
        }
        ListHeaderComponent={
          <>
            <AnimatedSpacer style={spacerStyle} />
            <StoryBar />
            <PostingStatus />
            <Separator />
          </>
        }
        ListEmptyComponent={
          <YStack padding="$6" alignItems="center">
            <Text fontSize={16} color="$color" opacity={0.6}>
              No posts yet
            </Text>
            <Text fontSize={14} color="$color" opacity={0.4} marginTop="$2">
              Pull down to refresh
            </Text>
          </YStack>
        }
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </YStack>
  )
}
