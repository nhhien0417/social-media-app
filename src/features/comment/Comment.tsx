import React, { useRef, useState, useEffect, useMemo } from 'react'
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
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XStack, YStack, SizableText } from 'tamagui'
import type { Comment } from '@/types/Comment'
import CommentList from './components/CommentList'
import CommentInput from './components/CommentInput'
import { useCommentStore } from '@/stores/commentStore'
import { getUserId } from '@/utils/SecureStore'
import { useProfileStore } from '@/stores/profileStore'
import { processMediaForUpload } from '@/utils/MediaUtils'
import { useAppColors } from '@/theme/useAppColors'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const SNAP_POINTS = {
  HIDDEN: SCREEN_HEIGHT,
  FULL: 0,
}

type Props = {
  visible: boolean
  onClose: () => void
  postId: string
  userAvatarUrl?: string
}

export default function Comment({
  visible,
  onClose,
  postId,
  userAvatarUrl,
}: Props) {
  const colors = useAppColors()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        absoluteFill: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.overlay,
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
          backgroundColor: colors.modal,
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
          backgroundColor: colors.textTertiary,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }),
    [colors]
  )
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  )
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  )
  const [isSending, setIsSending] = useState(false)

  const {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    isLoading,
  } = useCommentStore()
  const currentUser = useProfileStore(state => state.currentUser)

  useEffect(() => {
    getUserId().then(id => setCurrentUserId(id || undefined))
  }, [])

  useEffect(() => {
    if (visible && postId) {
      useCommentStore.setState({ comments: [], isLoading: true })
      fetchComments(postId)
    }
  }, [visible, postId])

  useEffect(() => {
    if (editingComment) {
      setCommentText(editingComment.content || '')
      inputRef.current?.focus()
    }
  }, [editingComment])

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
        setEditingComment(null)
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
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          translateY.setValue(g.dy)
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 150 || g.vy > 0.5) {
          closeSheet()
        } else {
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

  const handleSend = async (content: string, media: string[]) => {
    if (!currentUserId || isSending) return

    setIsSending(true)
    try {
      const mediaFiles = await processMediaForUpload(
        media.map(uri => ({ uri }))
      )

      if (editingComment) {
        await updateComment(
          {
            commentId: editingComment.id,
            content,
          },
          mediaFiles
        )
        setEditingComment(null)
      } else {
        await addComment(
          {
            postId,
            authorId: currentUserId,
            content,
            parentCommentId: replyingTo?.id,
          },
          mediaFiles
        )
      }
      setCommentText('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Failed to send comment:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleReply = (comment: Comment) => {
    const topLevelParent = comment.parentCommentId
      ? comments.find(c => c.id === comment.parentCommentId) || comment
      : comment

    setReplyingTo(topLevelParent)
    setEditingComment(null)
    setCommentText('')
    inputRef.current?.focus()
  }

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment)
    setReplyingTo(null)
    setCommentText(comment.content || '')
    inputRef.current?.focus()
  }

  const handleDelete = async (commentId: string) => {
    if (!currentUserId) return
    try {
      await deleteComment(commentId)
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
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

  const handleLike = async (commentId: string) => {
    if (!currentUserId) return
    await likeComment(commentId, currentUserId)
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setCommentText('')
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
                backgroundColor={colors.modal}
                borderBottomWidth={StyleSheet.hairlineWidth}
                borderColor={colors.border}
                paddingVertical="$3"
              >
                <YStack
                  style={styles.dragHandleArea}
                  backgroundColor={colors.modal}
                >
                  <YStack style={styles.dragHandle} />
                </YStack>
                <XStack justifyContent="center" alignItems="center">
                  <SizableText
                    fontSize={17}
                    fontWeight="700"
                    paddingTop="$1"
                    color={colors.text}
                  >
                    Comments
                  </SizableText>
                </XStack>
              </YStack>
            </YStack>

            {/* Comments List */}
            <YStack flex={1} backgroundColor={colors.modal}>
              {isLoading ? (
                <YStack style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.accent} />
                </YStack>
              ) : (
                <CommentList
                  comments={comments}
                  onLike={handleLike}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewReplies={handleViewReplies}
                  expandedComments={expandedComments}
                  currentUserId={currentUserId}
                  onCloseModal={closeSheet}
                />
              )}
            </YStack>

            {/* Bottom Bar */}
            <YStack>
              {/* Comment Input */}
              <CommentInput
                ref={inputRef}
                value={commentText}
                onChangeText={setCommentText}
                onSend={handleSend}
                userAvatarUrl={
                  currentUser?.avatarUrl ||
                  userAvatarUrl ||
                  'https://i.pravatar.cc/150?img=1'
                }
                replyingTo={replyingTo}
                editingComment={editingComment}
                onSelectEmotion={handleSelectEmotion}
                onCancelReply={() => setReplyingTo(null)}
                onCancelEdit={handleCancelEdit}
                isLoading={isSending}
              />
            </YStack>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  )
}
