import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Image,
  Pressable,
  Dimensions,
  StatusBar,
  StyleSheet,
  Animated,
} from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { X, MoreHorizontal } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { ProfileHighlight } from '@/mock/profile'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const STORY_DURATION = 5000 // 5 seconds per story

// Format timestamp to relative time
function formatTimestamp(timestamp: string): string {
  const now = new Date()
  const storyTime = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - storyTime.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - storyTime.getTime()) / (1000 * 60))
    if (diffInMinutes < 1) return 'Just now'
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

// Simple Progress Bar Component matching StoryViewer
function ProgressBar({
  isActive,
  isCompleted,
  duration,
  isPaused,
}: {
  isActive: boolean
  isCompleted: boolean
  duration: number
  isPaused: boolean
}) {
  const progressAnim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current

  useEffect(() => {
    if (isCompleted) {
      progressAnim.setValue(1)
      return
    }

    if (!isActive) {
      progressAnim.setValue(0)
      return
    }

    if (isPaused) {
      return
    }

    progressAnim.setValue(0)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start()
  }, [isActive, isCompleted, duration, isPaused])

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground} />
      <Animated.View
        style={[
          styles.progressBarFill,
          {
            width: progressWidth,
          },
        ]}
      />
    </View>
  )
}

interface HighlightViewerProps {
  highlight: ProfileHighlight
  username?: string
  avatarUrl?: string
}

export default function HighlightViewer({
  highlight,
  username = 'User',
  avatarUrl,
}: HighlightViewerProps) {
  const insets = useSafeAreaInsets()
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentStory = highlight.stories?.[currentStoryIndex]
  const totalStories = highlight.stories?.length || 0

  useEffect(() => {
    console.log('HighlightViewer mounted:', {
      highlightId: highlight.id,
      totalStories,
      currentStoryIndex,
      currentStory: currentStory ? 'exists' : 'null',
    })
  }, [highlight.id, totalStories, currentStoryIndex, currentStory])

  // Auto progress timer
  useEffect(() => {
    if (isPaused || !currentStory) return

    timerRef.current = setTimeout(() => {
      handleNext()
    }, STORY_DURATION)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentStoryIndex, isPaused, currentStory])

  const handleNext = () => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(prev => prev + 1)
    } else {
      // End of highlight, close viewer
      router.back()
    }
  }

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
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

  if (!currentStory) {
    console.log('No current story, returning fallback UI')
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text color="white" fontSize="$6">
            No story available
          </Text>
        </YStack>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Story Image Background */}
      <Image
        source={{ uri: currentStory.imageUrl || highlight.coverImage }}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
      />

      {/* Content Overlay with Layout matching StoryViewer */}
      <View style={styles.contentOverlay}>
        {/* Top Section with Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.topSection}
        >
          {/* Progress Bars */}
          <XStack gap={4} paddingHorizontal={16} paddingTop={insets.top + 8}>
            {Array.from({ length: totalStories }).map((_, index) => (
              <ProgressBar
                key={index}
                isActive={index === currentStoryIndex}
                isCompleted={index < currentStoryIndex}
                duration={STORY_DURATION}
                isPaused={isPaused}
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
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text color="white" fontSize={12} fontWeight="600">
                      {username[0]?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
            <YStack flex={1}>
              <Text
                color="#ffffff"
                fontSize={14}
                fontWeight="600"
                lineHeight={18}
              >
                {username}
              </Text>
              <Text color="rgba(255,255,255,0.7)" fontSize={12} lineHeight={16}>
                {formatTimestamp(currentStory.timestamp)}
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
            onPress={handleTapLeft}
            onLongPress={handleLongPressIn}
            onPressOut={handleLongPressOut}
          />
          <Pressable
            style={styles.tapRight}
            onPress={handleTapRight}
            onLongPress={handleLongPressIn}
            onPressOut={handleLongPressOut}
          />
        </View>

        {/* Story Content (if any text) */}
        {currentStory.text && (
          <View style={styles.contentContainer}>
            <Text
              color="white"
              fontSize={24}
              fontWeight="600"
              textAlign="center"
            >
              {currentStory.text}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentOverlay: {
    flex: 1,
  },
  topSection: {
    paddingTop: 0,
    paddingBottom: 16,
  },
  middleSection: {
    flex: 1,
    flexDirection: 'row',
  },
  tapLeft: {
    flex: 1,
  },
  tapRight: {
    flex: 2,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  avatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 2,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#000',
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  avatarPlaceholder: {
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
})
