import { useEffect } from 'react'
import { XStack, YStack, Text } from 'tamagui'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated'

export function TypingIndicator() {
  const dot1Opacity = useSharedValue(0.3)
  const dot2Opacity = useSharedValue(0.3)
  const dot3Opacity = useSharedValue(0.3)

  useEffect(() => {
    // Animate each dot with delays for wave effect
    dot1Opacity.value = withRepeat(withTiming(1, { duration: 600 }), -1, true)
    dot2Opacity.value = withRepeat(
      withDelay(200, withTiming(1, { duration: 600 })),
      -1,
      true
    )
    dot3Opacity.value = withRepeat(
      withDelay(400, withTiming(1, { duration: 600 })),
      -1,
      true
    )
  }, [])

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }))
  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }))
  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }))

  return (
    <XStack alignItems="center" gap="$1" paddingHorizontal="$1">
      <Animated.View style={dot1Style}>
        <Text fontSize="$6" lineHeight="$1">
          •
        </Text>
      </Animated.View>
      <Animated.View style={dot2Style}>
        <Text fontSize="$6" lineHeight="$1">
          •
        </Text>
      </Animated.View>
      <Animated.View style={dot3Style}>
        <Text fontSize="$6" lineHeight="$1">
          •
        </Text>
      </Animated.View>
    </XStack>
  )
}
