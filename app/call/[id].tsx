import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { YStack, XStack, Avatar, Text } from 'tamagui'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
// import { users } from '../../src/mock/users'

type CallState = 'calling' | 'connected' | 'ended'

export default function CallScreen() {
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

  const [callState, setCallState] = useState<CallState>('calling')
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(type === 'video')
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === 'video')
  const [duration, setDuration] = useState(0)
  const [isVideoCall] = useState<boolean>(type === 'video')

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const waveAnim = useRef(new Animated.Value(0)).current

  // Get user info
  const user = {
    id: id || '1',
    name: name || 'Unknown',
    avatarUrl: avatar || 'https://i.pravatar.cc/150?img=1',
  }

  // Simulate call connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallState('connected')
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Wave animation for calling state
  useEffect(() => {
    if (callState === 'calling') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [callState])

  // Duration counter
  useEffect(() => {
    if (callState === 'connected') {
      const interval = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [callState])

  // Pulse animation for calling state
  useEffect(() => {
    if (callState === 'calling') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
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
    }
  }, [callState])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    setCallState('ended')
    setTimeout(() => {
      // Navigate back to the specific chat, not to chat list
      if (chatId || id) {
        router.replace({
          pathname: '/message/[id]' as any,
          params: { id: chatId || id },
        })
      } else {
        router.back()
      }
    }, 300)
  }

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn)
  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled)

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Video Background (for video calls) - Messenger Style */}
      {isVideoCall && isVideoEnabled ? (
        <YStack flex={1} backgroundColor="#000">
          <StatusBar barStyle="light-content" />
          {/* Remote Video View - Placeholder */}
          <YStack
            flex={1}
            backgroundColor="#1a1a1a"
            justifyContent="center"
            alignItems="center"
          >
            {callState === 'connected' ? (
              <YStack alignItems="center" gap="$3">
                <Feather
                  name="video"
                  size={80}
                  color="rgba(255,255,255,0.15)"
                />
                <Text color="rgba(255,255,255,0.3)" fontSize={16}>
                  {user.name}
                </Text>
              </YStack>
            ) : (
              <YStack alignItems="center" gap="$4">
                {/* Avatar with rings */}
                <YStack
                  position="relative"
                  alignItems="center"
                  justifyContent="center"
                >
                  {callState === 'calling' && (
                    <>
                      <Animated.View
                        style={[
                          styles.ringOuter,
                          {
                            opacity: waveAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.4, 0],
                            }),
                            transform: [
                              {
                                scale: waveAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [1, 1.3],
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    </>
                  )}
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Avatar circular size={120}>
                      <Avatar.Image src={user.avatarUrl} />
                      <Avatar.Fallback backgroundColor="rgba(255,255,255,0.1)" />
                    </Avatar>
                  </Animated.View>
                </YStack>
                <Text color="white" fontSize={28} fontWeight="600">
                  {user.name}
                </Text>
                <Text color="rgba(255,255,255,0.7)" fontSize={16}>
                  Calling...
                </Text>
              </YStack>
            )}
          </YStack>

          {/* Local Video View (Picture-in-Picture) - Messenger Style */}
          {callState === 'connected' && (
            <Animated.View
              style={[
                styles.pipContainer,
                {
                  top: 20,
                  opacity: fadeAnim,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  width: 100,
                  height: 140,
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: '#2c2c2e',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.15)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                <Feather name="user" size={36} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </YStack>
      ) : (
        /* Voice Call UI - Messenger Style */
        <LinearGradient
          colors={['#0084ff', '#00c6ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        >
          <StatusBar barStyle="light-content" />
          <YStack flex={1} justifyContent="space-between" paddingTop={40}>
            {/* Top Section */}
            <YStack alignItems="center" paddingTop="$8">
              {/* Avatar with ring animations */}
              <YStack
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                {/* Outer rings for calling state */}
                {callState === 'calling' && (
                  <>
                    <Animated.View
                      style={[
                        styles.ringOuter,
                        {
                          opacity: waveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.6, 0],
                          }),
                          transform: [
                            {
                              scale: waveAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.4],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.ringMiddle,
                        {
                          opacity: waveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.4, 0],
                          }),
                          transform: [
                            {
                              scale: waveAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.3],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  </>
                )}

                {/* Avatar */}
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
                      <Avatar.Image src={user.avatarUrl} />
                      <Avatar.Fallback backgroundColor="rgba(255,255,255,0.2)" />
                    </Avatar>
                  </YStack>
                </Animated.View>
              </YStack>

              {/* User Name */}
              <Text
                color="white"
                fontSize={32}
                fontWeight="600"
                marginTop={24}
                textAlign="center"
              >
                {user.name}
              </Text>

              {/* Call Status */}
              <Text color="rgba(255,255,255,0.85)" fontSize={18} marginTop={8}>
                {callState === 'calling' && 'Calling...'}
                {callState === 'connected' && formatDuration(duration)}
                {callState === 'ended' && 'Call ended'}
              </Text>
            </YStack>

            {/* Spacer */}
            <YStack flex={1} />
          </YStack>
        </LinearGradient>
      )}

      {/* Control Buttons - Messenger Style */}
      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        paddingBottom={30}
        paddingHorizontal="$5"
      >
        {/* Main Controls Row */}
        <XStack
          justifyContent="space-around"
          alignItems="center"
          paddingHorizontal="$4"
        >
          {/* Mute Button */}
          <YStack alignItems="center" gap="$2">
            <TouchableOpacity
              onPress={toggleMute}
              activeOpacity={0.7}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: isMuted
                  ? 'rgba(255,59,48,0.9)'
                  : 'rgba(255,255,255,0.25)',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: isMuted ? 0 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Feather
                name={isMuted ? 'mic-off' : 'mic'}
                size={26}
                color="white"
              />
            </TouchableOpacity>
          </YStack>

          {/* End Call Button - Center */}
          <YStack alignItems="center">
            <TouchableOpacity
              onPress={handleEndCall}
              activeOpacity={0.8}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
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
              <Feather name="phone-off" size={28} color="white" />
            </TouchableOpacity>
          </YStack>

          {/* Video/Speaker Button */}
          {isVideoCall ? (
            <YStack alignItems="center" gap="$2">
              <TouchableOpacity
                onPress={toggleVideo}
                activeOpacity={0.7}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: !isVideoEnabled
                    ? 'rgba(255,59,48,0.9)'
                    : 'rgba(255,255,255,0.25)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: !isVideoEnabled ? 0 : 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Feather
                  name={isVideoEnabled ? 'video' : 'video-off'}
                  size={26}
                  color="white"
                />
              </TouchableOpacity>
            </YStack>
          ) : (
            <YStack alignItems="center" gap="$2">
              <TouchableOpacity
                onPress={toggleSpeaker}
                activeOpacity={0.7}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isSpeakerOn
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(255,255,255,0.25)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Feather
                  name={isSpeakerOn ? 'volume-2' : 'volume-x'}
                  size={26}
                  color="white"
                />
              </TouchableOpacity>
            </YStack>
          )}
        </XStack>
      </YStack>
    </YStack>
  )
}

const styles = StyleSheet.create({
  pipContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  ringOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ringMiddle: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
})
