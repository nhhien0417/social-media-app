import React, { useEffect, useCallback } from 'react'
import { YStack, XStack, Text, Button, PortalProvider, Portal } from 'tamagui'
import Avatar from '@/components/Avatar'
import { NotificationItem } from '@/types/Notification'
import { X } from '@tamagui/lucide-icons'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

interface NotificationToastProps {
  notification: NotificationItem | null
  onPress: (notification: NotificationItem) => void
  onDismiss: () => void
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onPress,
  onDismiss,
}) => {
  const translateY = useSharedValue(-100)
  const context = useSharedValue({ y: 0 })

  useEffect(() => {
    if (notification) {
      translateY.value = -100
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      })

      const timer = setTimeout(() => {
        handleDismiss()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleDismiss = useCallback(() => {
    'worklet'
    translateY.value = withTiming(
      -100,
      { duration: 250, easing: Easing.in(Easing.cubic) },
      () => {
        runOnJS(onDismiss)()
      }
    )
  }, [onDismiss, translateY])

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
    })
    .onUpdate(event => {
      if (event.translationY < 0) {
        translateY.value = event.translationY + context.value.y
      } else {
        translateY.value = event.translationY * 0.1 + context.value.y
      }
    })
    .onEnd(() => {
      if (translateY.value < -30) {
        runOnJS(handleDismiss)()
      } else {
        translateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  if (!notification) return null

  const ToastContent = (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            zIndex: 100000,
          },
          animatedStyle,
        ]}
      >
        <YStack
          backgroundColor="$background"
          borderRadius="$6"
          padding="$3"
          elevation={10}
          shadowColor="#000"
          shadowOpacity={0.15}
          shadowRadius={10}
          shadowOffset={{ width: 0, height: 5 }}
          onPress={() => onPress(notification)}
          pressStyle={{ opacity: 0.95 }}
          borderWidth={1}
          borderColor="$borderColor"
        >
          <XStack alignItems="center" gap="$3">
            <Avatar
              uri={`https://i.pravatar.cc/150?u=${notification.senderId}`}
              size={40}
            />
            <YStack flex={1} gap="$1">
              <Text fontWeight="600" fontSize="$4" numberOfLines={1}>
                New Notification
              </Text>
              <Text color="$color" fontSize="$4" numberOfLines={2}>
                {notification.message}
              </Text>
            </YStack>
            <Button
              size="$2"
              circular
              chromeless
              icon={<X size={16} />}
              onPress={e => {
                e.stopPropagation()
                handleDismiss()
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            />
          </XStack>
        </YStack>
      </Animated.View>
    </GestureDetector>
  )

  return (
    <PortalProvider>
      <Portal zIndex={100000}>{ToastContent}</Portal>
    </PortalProvider>
  )
}
