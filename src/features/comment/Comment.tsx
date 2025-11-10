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
import { XStack, YStack, SizableText } from 'tamagui'
import type { Comment } from '@/types/Comment'
import CommentList from './components/CommentList'
import CommentInput from './components/CommentInput'

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
  onSendComment: (content: string, parentId?: string) => void
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
    paddingVertical: 12,
    paddingHorizontal: 20,
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

  const handleSend = () => {
    if (commentText.trim()) {
      onSendComment(commentText.trim(), replyingTo?.id)
      setCommentText('')
      setReplyingTo(null)
    }
  }

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment)
    inputRef.current?.focus()
  }

  const handleViewReplies = (commentId: string) => {
    console.log('View replies for comment:', commentId)
  }

  const handleSelectEmotion = (emoji: string) => {
    setCommentText(prev => prev + emoji)
    inputRef.current?.focus()
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

      {/* Bottom Sheet with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: SCREEN_HEIGHT,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Draggable Header Area */}
          <YStack {...panResponder.panHandlers}>
            {/* Drag handle */}
            <YStack
              style={styles.dragHandleArea}
              backgroundColor="$backgroundModal"
            >
              <YStack style={styles.dragHandle} />
            </YStack>

            {/* Header */}
            <YStack
              backgroundColor="$backgroundModal"
              borderBottomWidth={StyleSheet.hairlineWidth}
              borderColor="$borderColor"
            >
              <XStack justifyContent="center" alignItems="center">
                <SizableText fontSize={17} fontWeight="700">
                  Comments
                </SizableText>
              </XStack>
            </YStack>
          </YStack>

          {/* Comments List - takes remaining space */}
          <YStack flex={1}>
            <CommentList
              comments={comments}
              onLike={onLikeComment}
              onReply={handleReply}
              onViewReplies={handleViewReplies}
            />
          </YStack>

          {/* Bottom Bar - Fixed at bottom */}
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
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
