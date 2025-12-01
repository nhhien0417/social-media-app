import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  PanResponder,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { X, Heart, Send, MoreHorizontal } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { stories as allStories } from '@/mock/stories'
import StoryProgressBar from './components/StoryProgressBar'
import Avatar from '@/components/Avatar'

const STORY_DURATION = 5000

interface StoryViewerProps {
  initialStoryId: string
}

export default function StoryViewer({ initialStoryId }: StoryViewerProps) {
  const insets = useSafeAreaInsets()

  // Sort stories: new stories first
  const sortedStories = [...allStories].sort((a, b) => {
    if (a.hasNew === b.hasNew) return 0
    return a.hasNew ? -1 : 1
  })

  const initialIndex = sortedStories.findIndex(s => s.id === initialStoryId)
  const [currentUserIndex, setCurrentUserIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  )
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentUser = sortedStories[currentUserIndex]
  const currentStory = currentUser?.stories?.[currentStoryIndex]
  const totalStories = currentUser?.stories?.length || 0

  useEffect(() => {
    if (!currentUser || totalStories === 0) {
      router.back()
    }
  }, [currentUser, totalStories])

  useEffect(() => {
    if (isPaused) return

    timerRef.current = setTimeout(() => {
      handleNext()
    }, STORY_DURATION)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentUserIndex, currentStoryIndex, isPaused])

  const handleNext = () => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(prev => prev + 1)
    } else {
      if (currentUserIndex < sortedStories.length - 1) {
        setCurrentUserIndex(prev => prev + 1)
        setCurrentStoryIndex(0)
      } else {
        router.back()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
    } else {
      if (currentUserIndex > 0) {
        const prevUserIndex = currentUserIndex - 1
        const prevUserStories =
          sortedStories[prevUserIndex]?.stories?.length || 1
        setCurrentUserIndex(prevUserIndex)
        setCurrentStoryIndex(prevUserStories - 1)
      }
    }
  }

  const handleTapLeft = () => {
    handlePrevious()
  }

  const handleTapRight = () => {
    handleNext()
  }

  const handleLongPressIn = () => {
    setIsPaused(true)
  }

  const handleLongPressOut = () => {
    setIsPaused(false)
  }

  const handleClose = () => {
    router.back()
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleReply = () => {
    setShowReplyInput(true)
    setIsPaused(true)
  }

  const handleSendReply = () => {
    setShowReplyInput(false)
    setIsPaused(false)
  }

  const handleDismissInput = () => {
    if (showReplyInput) {
      setShowReplyInput(false)
      setIsPaused(false)
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20
      },
      onPanResponderGrant: () => {
        setIsPaused(true)
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsPaused(false)
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (gestureState.dx > 50) {
            if (currentUserIndex > 0) {
              const prevUserIndex = currentUserIndex - 1
              const prevUserStories =
                sortedStories[prevUserIndex]?.stories?.length || 1
              setCurrentUserIndex(prevUserIndex)
              setCurrentStoryIndex(0)
            }
          } else if (gestureState.dx < -50) {
            // Swipe left - next user
            if (currentUserIndex < sortedStories.length - 1) {
              setCurrentUserIndex(prev => prev + 1)
              setCurrentStoryIndex(0)
            } else {
              router.back()
            }
          }
        }
        // Vertical swipe down - close
        else if (gestureState.dy > 100) {
          router.back()
        }
      },
    })
  ).current

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Story Image/Video Background */}
      {currentStory && (
        <Image
          source={{ uri: currentStory.mediaUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />
      )}

      {/* Content Overlay with Flexbox */}
      <View style={styles.contentOverlay} {...panResponder.panHandlers}>
        {/* Top Section with Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.topSection}
        >
          {/* Progress Bars */}
          <XStack gap={4} paddingHorizontal={16} paddingTop={insets.top + 8}>
            {Array.from({ length: totalStories }).map((_, index) => (
              <StoryProgressBar
                key={index}
                duration={STORY_DURATION}
                isPaused={isPaused}
                isActive={index === currentStoryIndex}
                isCompleted={index < currentStoryIndex}
              />
            ))}
          </XStack>

          {/* Header */}
          <XStack
            alignItems="center"
            gap={10}
            paddingHorizontal={16}
            paddingTop={12}
          >
            <LinearGradient
              colors={['#f58529', '#feda77', '#dd2a7b', '#8134af', '#515bd4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <View style={styles.avatarInner}>
                <Avatar
                  uri={currentUser.author.avatarUrl || undefined}
                  style={styles.avatar}
                />
              </View>
            </LinearGradient>
            <YStack flex={1}>
              <Text
                color="#ffffff"
                fontSize={14}
                fontWeight="600"
                lineHeight={18}
              >
                {currentUser.author.username}
              </Text>
              <Text color="rgba(255,255,255,0.7)" fontSize={12} lineHeight={16}>
                {new Date().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </YStack>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={8}
            >
              <X size={26} color="#ffffff" strokeWidth={2.5} />
            </Pressable>
            <Pressable style={styles.moreButton} hitSlop={8}>
              <MoreHorizontal size={24} color="#ffffff" strokeWidth={2.5} />
            </Pressable>
          </XStack>
        </LinearGradient>

        {/* Middle Section - Tap Areas */}
        <View style={styles.middleSection}>
          <Pressable
            style={styles.tapLeft}
            onPress={() => {
              if (showReplyInput) {
                handleDismissInput()
              } else {
                handleTapLeft()
              }
            }}
            onLongPress={handleLongPressIn}
            onPressOut={handleLongPressOut}
          />
          <Pressable
            style={styles.tapRight}
            onPress={() => {
              if (showReplyInput) {
                handleDismissInput()
              } else {
                handleTapRight()
              }
            }}
            onLongPress={handleLongPressIn}
            onPressOut={handleLongPressOut}
          />
        </View>

        {/* Bottom Section with Gradient */}
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: 'height' })}
          keyboardVerticalOffset={0}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={[
              styles.bottomSection,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            {/* Bottom Actions */}
            {!showReplyInput && (
              <XStack alignItems="center" gap={16} paddingHorizontal={16}>
                <Pressable style={styles.replyInput} onPress={handleReply}>
                  <Text color="rgba(255,255,255,0.7)" fontSize={14}>
                    Send message
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleLike}
                  style={styles.actionButton}
                  hitSlop={8}
                >
                  <Heart
                    size={28}
                    color="#ffffff"
                    fill={isLiked ? '#ff3040' : 'transparent'}
                    strokeWidth={2}
                  />
                </Pressable>
                <Pressable style={styles.actionButton} hitSlop={8}>
                  <Send size={26} color="#ffffff" strokeWidth={2} />
                </Pressable>
              </XStack>
            )}

            {/* Reply Input */}
            {showReplyInput && (
              <XStack alignItems="center" gap={12} paddingHorizontal={16}>
                <View style={styles.replyInputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Send message..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    autoFocus
                    onBlur={() => {
                      setShowReplyInput(false)
                      setIsPaused(false)
                    }}
                  />
                </View>
                <Pressable onPress={handleSendReply} style={styles.sendButton}>
                  <Send size={22} color="#ffffff" strokeWidth={2} />
                </Pressable>
              </XStack>
            )}
          </LinearGradient>
        </KeyboardAvoidingView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingBottom: 12,
  },
  middleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomSection: {
    paddingTop: 16,
  },
  avatarGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 2,
  },
  avatarInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#000000',
    padding: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  closeButton: {
    padding: 2,
  },
  moreButton: {
    padding: 2,
  },
  replyInput: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  actionButton: {
    padding: 4,
  },
  replyInputWrapper: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textInput: {
    color: '#ffffff',
    fontSize: 14,
    padding: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0095F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapLeft: {
    flex: 1,
  },
  tapRight: {
    flex: 1,
  },
})
