import React, { useEffect, useCallback, useState } from 'react'
import { YStack, XStack, Text, Button, PortalProvider, Portal } from 'tamagui'
import Avatar from '@/components/Avatar'
import { Notification } from '@/types/Notification'
import { X } from '@tamagui/lucide-icons'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useProfileStore } from '@/stores/profileStore'
import { getNotificationMessage } from '@/utils/NotificationMessage'
import { getNotificationIcon } from './NotificationIcon'

interface NotificationToastProps {
  notification: Notification | null
  onPress: (notification: Notification) => void
  onDismiss: () => void
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onPress,
  onDismiss,
}) => {
  const translateY = useSharedValue(-100)
  const context = useSharedValue({ y: 0 })
  const { fetchUser, users } = useProfileStore()
  const [sender, setSender] = useState(
    notification ? users[notification.senderId] : null
  )
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (notification) {
      setIsReady(false)
      const loadUser = async () => {
        const user = await fetchUser(notification.senderId)
        if (user) {
          setSender(user)
        }
        setIsReady(true)
      }
      loadUser()
    }
  }, [notification, fetchUser])

  useEffect(() => {
    if (isReady && notification) {
      translateY.value = -100
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      })

      const timer = setTimeout(() => {
        handleDismiss()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isReady, notification])

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

  if (!notification || !isReady) return null

  const senderName = sender?.username || 'Someone'
  const avatarUrl = sender?.avatarUrl || undefined

  const message = getNotificationMessage(notification.type, senderName)

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
            pointerEvents: 'box-none',
          },
          animatedStyle,
        ]}
      >
        <YStack
          backgroundColor="$background"
          borderRadius="$5"
          padding="$2.5"
          elevation={10}
          shadowColor="#000"
          shadowOpacity={0.15}
          shadowRadius={10}
          shadowOffset={{ width: 0, height: 5 }}
          onPress={() => onPress(notification)}
          pressStyle={{ opacity: 0.95 }}
          borderWidth={1}
          borderColor="$borderColor"
          style={{
            pointerEvents: 'auto',
          }}
        >
          <XStack alignItems="center" gap="$3">
            <YStack>
              <Avatar uri={avatarUrl} size={50} />
              <YStack
                position="absolute"
                bottom={-2}
                right={-2}
                backgroundColor="$background"
                borderRadius={100}
                padding={4}
                elevation="$1"
              >
                {getNotificationIcon(notification.type)}
              </YStack>
            </YStack>
            <YStack flex={1} gap="$0.5">
              <Text fontWeight="bold" fontSize={15} numberOfLines={1}>
                New Notification
              </Text>
              <Text color="$color" fontSize={14} numberOfLines={2}>
                {message}
              </Text>
            </YStack>
            <Button
              size="$2"
              circular
              chromeless
              icon={<X size={18} />}
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
