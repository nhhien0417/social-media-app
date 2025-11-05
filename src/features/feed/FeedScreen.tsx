import { FlatList, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { YStack, XStack, Text, Separator } from 'tamagui'
import { Send, Moon, Sun } from '@tamagui/lucide-icons'
import { Image } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  Easing,
} from 'react-native-reanimated'

import StoryBar from './components/StoryBar'
import PostCard from './components/PostCard'
import { posts } from '@/mock/posts'
import ButtonIcon from '@/components/IconButton'
import { useAppTheme } from '@/providers/ThemeProvider'

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
      <XStack alignItems="center" justifyContent="space-between">
        <Image
          source={require('@/assets/logo_0.png')}
          style={{ width: 50, height: 50 }}
        />
        <Text fontFamily="$heading" fontSize={25} fontWeight="600">
          Valorant
        </Text>
      </XStack>
      <XStack alignItems="center" justifyContent="space-between">
        <ButtonIcon Icon={Send} />
        <ButtonIcon
          Icon={theme === 'light' ? Moon : Sun}
          onPress={toggleTheme}
        />
      </XStack>
    </XStack>
  )
}

export default function FeedScreen() {
  const insets = useSafeAreaInsets()
  const TOTAL_HEADER_HEIGHT = HEADER_VIEW_HEIGHT + insets.top + 2

  const offset = useSharedValue(0)
  const lastY = useSharedValue(0)

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

  return (
    <YStack flex={1} backgroundColor="$background">
      <AnimatedHeader
        style={headerStyle}
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        paddingTop={insets.top}
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
        ListHeaderComponent={
          <>
            <AnimatedSpacer style={spacerStyle} />
            <StoryBar />
            <Separator />
          </>
        }
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </YStack>
  )
}
