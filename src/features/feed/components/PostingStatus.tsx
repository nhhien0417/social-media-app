import React, { useEffect } from 'react'
import { StyleSheet, Image } from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { CheckCircle2, AlertCircle } from '@tamagui/lucide-icons'
import { usePostStatus } from '@/providers/PostStatusProvider'
import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'

const AnimatedYStack = Animated.createAnimatedComponent(YStack)
const AnimatedXStack = Animated.createAnimatedComponent(XStack)
const AnimatedImage = Animated.createAnimatedComponent(Image)

const TRACK_H = 4
const BAR_RATIO = 0.35

export default function PostingStatus() {
  const { status, mediaUrl, lastOperation, mode, customSuccessMessage } =
    usePostStatus()
  const isVisible = status !== 'idle'

  const containerOpacity = useSharedValue(0)
  const containerHeight = useSharedValue(0)
  const contentOpacity = useSharedValue(0)

  const trackWidth = useSharedValue(0)
  const driver = useSharedValue(0)

  const imageScale = useSharedValue(1)
  const iconScale = useSharedValue(0)

  const typeText = mode === 'STORY' ? 'story' : 'post'
  const TypeText = mode === 'STORY' ? 'Story' : 'Post'

  const getSuccessMessage = () => {
    if (customSuccessMessage) return customSuccessMessage

    switch (lastOperation) {
      case 'updating':
        return {
          title: `${TypeText} updated successfully!`,
          subtitle: 'Your changes have been saved',
        }
      case 'deleting':
        return {
          title: `${TypeText} deleted successfully!`,
          subtitle: `Your ${typeText} has been removed`,
        }
      default:
        return {
          title: `${TypeText} shared successfully!`,
          subtitle: `Your friends can now see your ${typeText}`,
        }
    }
  }

  const getErrorMessage = () => {
    switch (lastOperation) {
      case 'updating':
        return {
          title: `Couldn't update your ${typeText}`,
          subtitle: 'Something went wrong. Please try again.',
        }
      case 'deleting':
        return {
          title: `Couldn't delete your ${typeText}`,
          subtitle: 'Something went wrong. Please try again.',
        }
      default:
        return {
          title: `Couldn't share your ${typeText}`,
          subtitle: 'Something went wrong. Please try again.',
        }
    }
  }

  useEffect(() => {
    if (
      status === 'posting' ||
      status === 'deleting' ||
      status === 'updating'
    ) {
      containerOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      })

      containerHeight.value = withTiming(65, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      })

      contentOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      })

      imageScale.value = 1
      iconScale.value = 0

      driver.value = 0
      driver.value = withRepeat(
        withTiming(3, { duration: 1500, easing: Easing.linear }),
        -1,
        false
      )
    } else if (status === 'success') {
      cancelAnimation(driver)

      imageScale.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      })

      iconScale.value = withSequence(
        withTiming(0, { duration: 300 }),
        withTiming(1.2, { duration: 250, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) })
      )

      contentOpacity.value = withSequence(
        withTiming(0.7, { duration: 200 }),
        withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
      )

      setTimeout(() => {
        contentOpacity.value = withTiming(0, { duration: 400 })
        containerOpacity.value = withTiming(0, { duration: 400 })
        containerHeight.value = withTiming(0, { duration: 400 })
        iconScale.value = 0
        imageScale.value = 1
        driver.value = 0
      }, 10000)
    } else if (status === 'error') {
      cancelAnimation(driver)
      imageScale.value = withTiming(0, { duration: 300 })

      iconScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.2, { duration: 250, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) })
      )

      contentOpacity.value = withSequence(
        withTiming(0, { duration: 250 }),
        withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) })
      )

      setTimeout(() => {
        contentOpacity.value = withTiming(0, { duration: 400 })
        containerOpacity.value = withTiming(0, { duration: 400 })
        containerHeight.value = withTiming(0, { duration: 400 })
        iconScale.value = 0
        imageScale.value = 1
        driver.value = 0
      }, 5000)
    } else if (status === 'idle') {
      containerOpacity.value = 0
      containerHeight.value = 0
      contentOpacity.value = 0
      imageScale.value = 1
      iconScale.value = 0
      driver.value = 0
    }
  }, [status, mediaUrl])

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    height: containerHeight.value,
    overflow: 'hidden',
  }))

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }))

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
    opacity: imageScale.value,
  }))

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconScale.value,
  }))

  const progressStyle = useAnimatedStyle(() => {
    const track = trackWidth.value || 0
    const barMax = BAR_RATIO * track

    let w = 0
    let x = 0

    const p = driver.value

    if (track <= 0) {
      w = 0
      x = 0
    } else if (p < 1) {
      const t = p
      w = t * barMax
      x = 0
    } else if (p < 2) {
      const t = p - 1
      w = barMax
      x = t * (track - barMax)
    } else {
      const t = p - 2
      w = (1 - t) * barMax
      x = track - w
    }

    return {
      width: w,
      transform: [{ translateX: x }],
    }
  })

  if (!isVisible) return null

  return (
    <AnimatedYStack
      style={containerStyle}
      backgroundColor="$background"
      borderBottomWidth={StyleSheet.hairlineWidth}
      borderColor="$borderColor"
      paddingHorizontal="$3"
      paddingVertical="$2"
    >
      {status === 'posting' && (
        <AnimatedXStack style={contentStyle} gap="$3" alignItems="center">
          {mediaUrl && (
            <AnimatedImage
              source={{ uri: mediaUrl }}
              style={[
                imageStyle,
                {
                  width: 45,
                  height: 45,
                  borderRadius: 10,
                },
              ]}
              resizeMode="cover"
            />
          )}
          <YStack flex={1} gap="$2.5" justifyContent="center">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Creating your {typeText}...
            </Text>

            {/* Track */}
            <YStack
              height={TRACK_H}
              backgroundColor="$color"
              borderRadius={2}
              overflow="hidden"
              position="relative"
              width="100%"
              onLayout={e => {
                trackWidth.value = e.nativeEvent.layout.width
              }}
            >
              {/* Animated wrapper (width/translateX are animated) */}
              <Animated.View
                style={[
                  progressStyle,
                  {
                    height: TRACK_H,
                    borderRadius: 2,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  },
                ]}
              >
                <LinearGradient
                  colors={INSTAGRAM_GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </YStack>
          </YStack>
        </AnimatedXStack>
      )}

      {status === 'updating' && (
        <AnimatedXStack style={contentStyle} gap="$3" alignItems="center">
          {mediaUrl && (
            <AnimatedImage
              source={{ uri: mediaUrl }}
              style={[
                imageStyle,
                {
                  width: 45,
                  height: 45,
                  borderRadius: 10,
                },
              ]}
              resizeMode="cover"
            />
          )}
          <YStack flex={1} gap="$2.5" justifyContent="center">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Updating your {typeText}...
            </Text>

            <YStack
              height={TRACK_H}
              backgroundColor="$color"
              borderRadius={2}
              overflow="hidden"
              position="relative"
              width="100%"
              onLayout={e => {
                trackWidth.value = e.nativeEvent.layout.width
              }}
            >
              <Animated.View
                style={[
                  progressStyle,
                  {
                    height: TRACK_H,
                    borderRadius: 2,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  },
                ]}
              >
                <LinearGradient
                  colors={INSTAGRAM_GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </YStack>
          </YStack>
        </AnimatedXStack>
      )}

      {status === 'deleting' && (
        <AnimatedXStack style={contentStyle} gap="$3" alignItems="center">
          {mediaUrl && (
            <AnimatedImage
              source={{ uri: mediaUrl }}
              style={[
                imageStyle,
                {
                  width: 45,
                  height: 45,
                  borderRadius: 10,
                },
              ]}
              resizeMode="cover"
            />
          )}
          <YStack flex={1} gap="$2.5" justifyContent="center">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Deleting your {typeText}...
            </Text>

            <YStack
              height={TRACK_H}
              backgroundColor="$color"
              borderRadius={2}
              overflow="hidden"
              position="relative"
              width="100%"
              onLayout={e => {
                trackWidth.value = e.nativeEvent.layout.width
              }}
            >
              <Animated.View
                style={[
                  progressStyle,
                  {
                    height: TRACK_H,
                    borderRadius: 2,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  },
                ]}
              >
                <LinearGradient
                  colors={INSTAGRAM_GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </YStack>
          </YStack>
        </AnimatedXStack>
      )}

      {status === 'success' && (
        <AnimatedXStack style={contentStyle} gap="$3" alignItems="center">
          <YStack
            width={45}
            height={45}
            justifyContent="center"
            alignItems="center"
          >
            {mediaUrl && (
              <AnimatedImage
                source={{ uri: mediaUrl }}
                style={[
                  imageStyle,
                  {
                    width: 45,
                    height: 45,
                    borderRadius: 10,
                    position: 'absolute',
                  },
                ]}
                resizeMode="cover"
              />
            )}
            <Animated.View style={iconStyle}>
              <CheckCircle2 size={30} color="#10b981" />
            </Animated.View>
          </YStack>
          <YStack flex={1} justifyContent="center">
            <Text fontSize="$5" fontWeight="700" color="$color">
              {getSuccessMessage().title}
            </Text>
            <Text fontSize="$3" color="#888">
              {getSuccessMessage().subtitle}
            </Text>
          </YStack>
        </AnimatedXStack>
      )}

      {status === 'error' && (
        <AnimatedXStack style={contentStyle} gap="$3" alignItems="center">
          <YStack
            width={45}
            height={45}
            justifyContent="center"
            alignItems="center"
          >
            <Animated.View style={iconStyle}>
              <AlertCircle size={30} color="#ef4444" />
            </Animated.View>
          </YStack>
          <YStack flex={1} justifyContent="center">
            <Text fontSize="$5" fontWeight="700" color="#ef4444">
              {getErrorMessage().title}
            </Text>
            <Text fontSize="$3" color="#888" numberOfLines={2}>
              {getErrorMessage().subtitle}
            </Text>
          </YStack>
        </AnimatedXStack>
      )}
    </AnimatedYStack>
  )
}
