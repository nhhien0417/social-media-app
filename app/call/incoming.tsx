import React, { useEffect, useRef } from 'react'
import { StyleSheet, Animated, StatusBar } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { YStack, XStack, Avatar, Text } from 'tamagui'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity } from 'react-native'

export default function IncomingCallScreen() {
  const {
    id,
    type = 'voice',
    name,
    avatar,
    chatId,
  } = useLocalSearchParams<{
    id: string
    type?: string
    name?: string
    avatar?: string
    chatId?: string
  }>()

  const isVideoCall = type === 'video'

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    // Pulse animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Slide up animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleAccept = () => {
    router.replace({
      // @ts-ignore
      pathname: '/call/[id]',
      params: { id, type, name, avatar, chatId },
    })
  }

  const handleDecline = () => {
    // Navigate back to the specific chat, not to chat list
    if (chatId || id) {
      router.replace({
        pathname: '/message/[id]' as any,
        params: { id: chatId || id },
      })
    } else {
      router.back()
    }
  }

  return (
    <LinearGradient
      colors={['#0084ff', '#00c6ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <StatusBar barStyle="light-content" />
      <YStack flex={1} paddingTop={60} paddingBottom={40}>
        {/* Avatar and Info */}
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <YStack
              width={140}
              height={140}
              borderRadius={70}
              overflow="hidden"
              borderWidth={4}
              borderColor="rgba(255,255,255,0.3)"
            >
              <Avatar circular size={140}>
                <Avatar.Image
                  src={avatar || 'https://i.pravatar.cc/150?img=1'}
                />
                <Avatar.Fallback backgroundColor="rgba(255,255,255,0.2)" />
              </Avatar>
            </YStack>
          </Animated.View>

          <Text
            color="white"
            fontSize={32}
            fontWeight="600"
            marginTop={24}
            textAlign="center"
          >
            {name || 'Unknown'}
          </Text>

          <Text color="rgba(255,255,255,0.85)" fontSize={18} marginTop={8}>
            {isVideoCall ? 'Messenger Video Chat' : 'Messenger Audio Call'}
          </Text>

          {/* Ringing text */}
          <Text color="rgba(255,255,255,0.7)" fontSize={16} marginTop={4}>
            Ringing...
          </Text>
        </YStack>

        {/* Action Buttons - Messenger Style */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0],
            }),
          }}
        >
          <XStack justifyContent="center" gap={80} paddingHorizontal="$4">
            {/* Decline Button */}
            <YStack alignItems="center" gap={12}>
              <TouchableOpacity
                onPress={handleDecline}
                activeOpacity={0.8}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  backgroundColor: '#ff3b30',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Feather name="phone-off" size={30} color="white" />
              </TouchableOpacity>
              <Text color="white" fontSize={15} fontWeight="500">
                Decline
              </Text>
            </YStack>

            {/* Accept Button */}
            <YStack alignItems="center" gap={12}>
              <TouchableOpacity
                onPress={handleAccept}
                activeOpacity={0.8}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 34,
                  backgroundColor: '#4cd964',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Feather
                  name={isVideoCall ? 'video' : 'phone'}
                  size={30}
                  color="white"
                />
              </TouchableOpacity>
              <Text color="white" fontSize={15} fontWeight="500">
                Accept
              </Text>
            </YStack>
          </XStack>

          {/* Message and Remind Options */}
          <XStack justifyContent="center" gap={60} marginTop={40}>
            <YStack alignItems="center" gap={8}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (chatId || id) {
                    router.replace({
                      pathname: '/message/[id]' as any,
                      params: { id: chatId || id },
                    })
                  }
                }}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Feather name="message-circle" size={24} color="white" />
              </TouchableOpacity>
              <Text color="rgba(255,255,255,0.85)" fontSize={13}>
                Message
              </Text>
            </YStack>

            <YStack alignItems="center" gap={8}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Feather name="clock" size={24} color="white" />
              </TouchableOpacity>
              <Text color="rgba(255,255,255,0.85)" fontSize={13}>
                Remind Me
              </Text>
            </YStack>
          </XStack>
        </Animated.View>
      </YStack>
    </LinearGradient>
  )
}
