import React from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, Text, Button, Input, Image, Separator } from 'tamagui'
import { PlusCircle, Search, MessageCircleMore } from '@tamagui/lucide-icons'
import Avatar from '@/components/Avatar'
import StoryBar from './components/StoryBar'
import PostCard from './components/PostCard'
import { posts } from '@/mock/db'
import { Post } from '@/types/models'

const HEADER_HEIGHT = 60
const TABBAR_HEIGHT = 56

const AnimatedHeader = Animated.createAnimatedComponent(XStack)
const AnimatedSpacer = Animated.createAnimatedComponent(YStack)
const AnimatedList = Animated.createAnimatedComponent(FlatList<Post>)

export default function FeedScreen() {
  const insets = useSafeAreaInsets()
  const offset = useSharedValue(0)
  const lastY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      const y = e.contentOffset.y
      const dy = y - lastY.value

      if (dy > 5 && offset.value < HEADER_HEIGHT) {
        offset.value = Math.min(HEADER_HEIGHT, offset.value + dy / 2)
      } else if (dy < -5 && offset.value > 0) {
        offset.value = Math.max(0, offset.value + dy / 2)
      }
      lastY.value = y
    },
  })

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(-offset.value, {
          duration: 120,
          easing: Easing.out(Easing.quad),
        }),
      },
    ],
    opacity: withTiming(1 - offset.value / HEADER_HEIGHT, {
      duration: 120,
      easing: Easing.linear,
    }),
  }))

  const spacerStyle = useAnimatedStyle(() => ({
    height: withTiming(HEADER_HEIGHT - offset.value, {
      duration: 120,
      easing: Easing.out(Easing.quad),
    }),
  }))

  const Header = () => (
    <AnimatedHeader
      style={headerStyle}
      height={HEADER_HEIGHT}
      paddingHorizontal="$3"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="white"
      borderBottomWidth={0.3}
      borderColor="rgba(0,0,0,0.1)"
      position="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={10}
      elevation={6}
    >
      <Text fontSize={22} fontWeight="700" color="#1877F2">facebook</Text>
      <XStack gap="$2">
        <Button size="$3" circular chromeless icon={PlusCircle} />
        <Button size="$3" circular chromeless icon={Search} />
        <Button size="$3" circular chromeless icon={MessageCircleMore} />
      </XStack>
    </AnimatedHeader>
  )

  const Composer = () => (
    <YStack paddingHorizontal="$3" paddingVertical="$2" backgroundColor="white">
      <XStack alignItems="center" gap="$2">
        <Avatar uri="https://i.pravatar.cc/100?img=40" />
        <Input
          flex={1}
          placeholder="What's on your mind?"
          backgroundColor="$color2"
          borderColor="$color5"
          borderRadius="$10"
          paddingHorizontal="$3"
        />
        <Button size="$3" chromeless>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/892/892692.png' }}
            width={22}
            height={22}
          />
        </Button>
      </XStack>
      <Separator marginTop="$2" opacity={0.08} />
    </YStack>
  )

  return (
    <YStack flex={1} backgroundColor="$background">
      <Header />
      <AnimatedList
        data={posts}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <AnimatedSpacer style={spacerStyle} />
            <Composer />
            <StoryBar />
          </>
        }
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </YStack>
  )
}
