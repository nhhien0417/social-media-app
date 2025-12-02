import React, { useState, useEffect, useRef, useMemo } from 'react'
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
} from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { X, Heart, Send, MoreHorizontal } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import StoryProgressBar from './components/StoryProgressBar'
import Avatar from '@/components/Avatar'
import { usePostStore } from '@/stores/postStore'
import { Post } from '@/types/Post'
import { formatDate } from '@/utils/FormatDate'
import PostOptionsSheet from '../feed/components/PostOptionsSheet'
import DeleteConfirmModal from '../feed/components/DeleteConfirmModal'
import { useCurrentUser } from '@/hooks/useProfile'

const STORY_DURATION = 5000

export default function StoryViewer() {
  const { id: storyId } = useLocalSearchParams<{ id: string }>()
  const stories = usePostStore(state => state.stories)
  const currentUser = useCurrentUser()

  // Group stories by author
  const groupedStories = useMemo(() => {
    const groups: { [key: string]: Post[] } = {}
    stories.forEach(story => {
      if (!story.authorProfile) return
      const aId = story.authorProfile.id
      if (!groups[aId]) {
        groups[aId] = []
      }
      groups[aId].push(story)
    })
    return Object.values(groups)
  }, [stories])

  const { initialUserIndex, initialStoryIndex } = useMemo(() => {
    let userIndex = 0
    let storyIndex = 0

    for (let i = 0; i < groupedStories.length; i++) {
      const userStories = groupedStories[i]
      const sIndex = userStories.findIndex(s => s.id === storyId)
      if (sIndex !== -1) {
        userIndex = i
        storyIndex = sIndex
        break
      }
    }
    return { initialUserIndex: userIndex, initialStoryIndex: storyIndex }
  }, [groupedStories, storyId])

  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex)
  const [isPaused, setIsPaused] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [optionsSheetVisible, setOptionsSheetVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentUserStories = groupedStories[currentUserIndex]
  const currentStory = currentUserStories?.[currentStoryIndex]
  const totalStories = currentUserStories?.length || 0
  const author = currentStory?.authorProfile
  const isOwner = currentUser?.id === author?.id
  const [isFocused, setIsFocused] = useState(true)

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      setIsPaused(false)

      return () => {
        setIsFocused(false)
        setIsPaused(true)
      }
    }, [])
  )

  useEffect(() => {
    if (!currentUserStories || totalStories === 0) {
      router.back()
    }
  }, [currentUserStories, totalStories])

  useEffect(() => {
    if (isPaused || optionsSheetVisible || deleteModalVisible || !isFocused)
      return

    timerRef.current = setTimeout(() => {
      handleNext()
    }, STORY_DURATION)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [
    currentUserIndex,
    currentStoryIndex,
    isPaused,
    optionsSheetVisible,
    deleteModalVisible,
    isFocused,
  ])

  const handleNext = () => {
    if (currentStoryIndex < totalStories - 1) {
      const nextStoryIndex = currentStoryIndex + 1
      setCurrentStoryIndex(nextStoryIndex)
      router.setParams({ id: currentUserStories[nextStoryIndex].id })
    } else {
      if (currentUserIndex < groupedStories.length - 1) {
        const nextUserIndex = currentUserIndex + 1
        setCurrentUserIndex(nextUserIndex)
        setCurrentStoryIndex(0)
        router.setParams({ id: groupedStories[nextUserIndex][0].id })
      } else {
        router.back()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      const prevStoryIndex = currentStoryIndex - 1
      setCurrentStoryIndex(prevStoryIndex)
      router.setParams({ id: currentUserStories[prevStoryIndex].id })
    } else {
      if (currentUserIndex > 0) {
        const prevUserIndex = currentUserIndex - 1
        const prevUserStories = groupedStories[prevUserIndex]
        const prevStoryIndex = prevUserStories.length - 1
        setCurrentUserIndex(prevUserIndex)
        setCurrentStoryIndex(prevStoryIndex)
        router.setParams({ id: prevUserStories[prevStoryIndex].id })
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
    if (!showReplyInput) {
      setIsPaused(false)
    }
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

  const handleDelete = () => {
    setDeleteModalVisible(true)
  }

  const handleEdit = () => {
    setIsPaused(true)
    router.push({
      pathname: '/create',
      params: { editPostId: storyId, mode: 'STORY' },
    })
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
        if (!showReplyInput) {
          setIsPaused(false)
        }
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          if (gestureState.dx > 50) {
            if (currentUserIndex > 0) {
              const prevUserIndex = currentUserIndex - 1
              const prevUserStories = groupedStories[prevUserIndex]
              setCurrentUserIndex(prevUserIndex)
              setCurrentStoryIndex(0)
              router.setParams({ id: prevUserStories[0].id })
            }
          } else if (gestureState.dx < -50) {
            // Swipe left - next user
            if (currentUserIndex < groupedStories.length - 1) {
              const nextUserIndex = currentUserIndex + 1
              setCurrentUserIndex(nextUserIndex)
              setCurrentStoryIndex(0)
              router.setParams({ id: groupedStories[nextUserIndex][0].id })
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

  if (!currentStory || !author) return null

  // Get the first media item URL if available, otherwise use a placeholder or handle text stories
  const mediaUrl =
    currentStory.media && currentStory.media.length > 0
      ? currentStory.media[0]
      : null

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Story Image/Video Background */}
      {mediaUrl ? (
        <Image
          source={{ uri: mediaUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#333',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Text color="white" fontSize={20} textAlign="center" padding={20}>
            {currentStory.content}
          </Text>
        </View>
      )}

      {/* Content Overlay with Flexbox */}
      <View style={styles.contentOverlay} {...panResponder.panHandlers}>
        {/* Top Section with Gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.topSection}
        >
          {/* Progress Bars */}
          <XStack gap={4} paddingHorizontal={16} paddingTop={16}>
            {Array.from({ length: totalStories }).map((_, index) => (
              <StoryProgressBar
                key={index}
                duration={STORY_DURATION}
                isPaused={isPaused || optionsSheetVisible || deleteModalVisible}
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
                  uri={author.avatarUrl || undefined}
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
                {author.username}
              </Text>
              <Text color="rgba(255,255,255,0.7)" fontSize={12} lineHeight={16}>
                {formatDate(currentStory.createdAt)}
              </Text>
            </YStack>
            <Pressable
              style={styles.moreButton}
              hitSlop={8}
              onPress={() => {
                setOptionsSheetVisible(true)
                setIsPaused(true)
              }}
            >
              <MoreHorizontal size={24} color="#ffffff" strokeWidth={2.5} />
            </Pressable>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={8}
            >
              <X size={26} color="#ffffff" strokeWidth={2.5} />
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
            style={[styles.bottomSection, { paddingBottom: 16 }]}
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

      <PostOptionsSheet
        visible={optionsSheetVisible}
        onClose={() => {
          setOptionsSheetVisible(false)
          setIsPaused(false)
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isOwner={isOwner}
        mode="STORY"
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false)
          setIsPaused(false)
        }}
        postId={currentStory.id}
        thumbnailUrl={mediaUrl || undefined}
        mode="STORY"
      />
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
