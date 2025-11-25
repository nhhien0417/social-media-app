import React, { useRef, useState, useEffect } from 'react'
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XStack, YStack, SizableText } from 'tamagui'
import type { Comment } from '@/types/Comment'
import CommentList from './components/CommentList'
import CommentInput from './components/CommentInput'
import { User } from '@/types/User'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const SNAP_POINTS = {
  HIDDEN: SCREEN_HEIGHT,
  FULL: 0,
}

type Props = {
  visible: boolean
  onClose: () => void
  postId: string
  comments: Comment[]
  onSendComment: (content?: string, media?: string[], parentId?: string) => void
  onLikeComment: (commentId: string) => void
  userAvatarUrl?: string
}

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  dragHandleArea: {
    alignItems: 'center',
    width: '100%',
  },
  dragHandle: {
    width: 50,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#888',
  },
})

const MOCK_USER: User = {
  id: 'user-1',
  username: 'current_user',
  email: 'test@test.com',
  firstName: 'Test',
  lastName: 'User',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
  gender: 'male',
  dob: '2000-01-01',
  bio: 'Hello',
  posts: [],
  friendships: [],
  friendStatus: 'NONE',
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    postId: 'post-1',
    author: {
      ...MOCK_USER,
      id: 'user-2',
      username: 'alice',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    content: 'This is a text only comment',
    media: [],
    createdAt: new Date().toISOString(),
    likes: ['user-1'],
  },
  {
    id: '2',
    postId: 'post-1',
    author: {
      ...MOCK_USER,
      id: 'user-3',
      username: 'bob',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
    },
    content: 'Check out this photo!',
    media: [
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: [],
  },
  {
    id: '3',
    postId: 'post-1',
    author: {
      ...MOCK_USER,
      id: 'user-4',
      username: 'charlie',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    media: [
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: ['user-2', 'user-3'],
  },
  {
    id: '4',
    postId: 'post-1',
    author: {
      ...MOCK_USER,
      id: 'user-2',
      username: 'alice',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    content: 'Reply to text comment',
    media: [],
    createdAt: new Date().toISOString(),
    parentCommentId: '1',
    likes: [],
  },
]

export default function Comment({
  visible,
  onClose,
  postId,
  comments,
  onSendComment,
  onLikeComment,
  userAvatarUrl = 'https://i.pravatar.cc/150?img=1',
}: Props) {
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  )

  const [localComments, setLocalComments] = useState<Comment[]>(MOCK_COMMENTS)

  // Sync with props if needed, but for this task we use MOCK_COMMENTS primarily
  // useEffect(() => {
  //   if (comments.length > 0) setLocalComments(comments)
  // }, [comments])

  const inputRef = useRef<RNTextInput>(null)

  const translateY = useRef(new Animated.Value(SNAP_POINTS.HIDDEN)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      translateY.setValue(SNAP_POINTS.HIDDEN)
      openSheet()
    }
  }, [visible])

  const openSheet = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SNAP_POINTS.FULL,
        useNativeDriver: true,
        damping: 50,
        stiffness: 500,
        mass: 1,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SNAP_POINTS.HIDDEN,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClose()
        setReplyingTo(null)
        setCommentText('')
      }
    })
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dy) > 10 && Math.abs(g.dy) > Math.abs(g.dx)
      },
      onPanResponderGrant: () => {
        // Store the current translateY value
      },
      onPanResponderMove: (_, g) => {
        // Only allow downward drag
        if (g.dy > 0) {
          translateY.setValue(g.dy)
        }
      },
      onPanResponderRelease: (_, g) => {
        // If dragged down more than 150px or fast velocity, close
        if (g.dy > 150 || g.vy > 0.5) {
          closeSheet()
        } else {
          // Otherwise snap back to full
          Animated.spring(translateY, {
            toValue: SNAP_POINTS.FULL,
            useNativeDriver: true,
            damping: 50,
            stiffness: 500,
            mass: 1,
          }).start()
        }
      },
      onPanResponderTerminate: () => {
        // Snap back to full on termination
        Animated.spring(translateY, {
          toValue: SNAP_POINTS.FULL,
          useNativeDriver: true,
          damping: 50,
          stiffness: 500,
          mass: 1,
        }).start()
      },
    })
  ).current

  const handleSend = (content: string, media: string[]) => {
    // Mock adding comment
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: MOCK_USER,
      content,
      media,
      createdAt: new Date().toISOString(),
      parentCommentId: replyingTo?.id,
      likes: [],
    }

    setLocalComments(prev => [newComment, ...prev])
    setCommentText('')
    setReplyingTo(null)
  }

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment)
    inputRef.current?.focus()
  }

  const handleViewReplies = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const handleSelectEmotion = (emoji: string) => {
    setCommentText(prev => prev + emoji)
    inputRef.current?.focus()
  }

  const handleLike = (commentId: string) => {
    setLocalComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const isLiked = c.likes?.includes(MOCK_USER.id)
          const newLikes = isLiked
            ? c.likes?.filter(id => id !== MOCK_USER.id)
            : [...(c.likes || []), MOCK_USER.id]
          return { ...c, likes: newLikes }
        }
        return c
      })
    )
  }

  if (!visible) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View style={[styles.absoluteFill, { opacity: overlayOpacity }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={closeSheet}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
          edges={['top', 'bottom']}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.select({
              ios: 'padding',
              android: 'height',
            })}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 55 : 0}
          >
            <YStack {...panResponder.panHandlers}>
              {/* Header */}
              <YStack
                backgroundColor="$backgroundModal"
                borderBottomWidth={StyleSheet.hairlineWidth}
                borderColor="$borderColor"
                paddingVertical="$3"
              >
                <YStack
                  style={styles.dragHandleArea}
                  backgroundColor="$backgroundModal"
                >
                  <YStack style={styles.dragHandle} />
                </YStack>
                <XStack justifyContent="center" alignItems="center">
                  <SizableText fontSize={17} fontWeight="700" paddingTop="$1">
                    Comments
                  </SizableText>
                </XStack>
              </YStack>
            </YStack>

            {/* Comments List */}
            <YStack flex={1}>
              <CommentList
                comments={localComments}
                onLike={handleLike}
                onReply={handleReply}
                onViewReplies={handleViewReplies}
                expandedComments={expandedComments}
                currentUserId={MOCK_USER.id}
              />
            </YStack>

            {/* Bottom Bar */}
            <YStack>
              {/* Comment Input */}
              <CommentInput
                ref={inputRef}
                value={commentText}
                onChangeText={setCommentText}
                onSend={handleSend}
                userAvatarUrl={userAvatarUrl}
                replyingTo={replyingTo}
                onSelectEmotion={handleSelectEmotion}
                onCancelReply={() => setReplyingTo(null)}
              />
            </YStack>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  )
}
