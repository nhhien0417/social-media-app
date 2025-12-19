import React, { useEffect, memo } from 'react'
import { XStack } from 'tamagui'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'

const Dot = memo(({ delay }: { delay: number }) => {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = 1

    const timeout = setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, {
            duration: 350,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(1, {
            duration: 350,
            easing: Easing.in(Easing.ease),
          })
        ),
        -1,
        false
      )
    }, delay)

    return () => clearTimeout(timeout)
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      style={[
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'white',
        },
        animatedStyle,
      ]}
    />
  )
})

export const TypingIndicator = () => {
  return (
    <XStack
      gap="$1.5"
      padding="$1.5"
      alignItems="center"
      justifyContent="center"
    >
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </XStack>
  )
}
