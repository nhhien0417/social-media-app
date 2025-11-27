import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native'
import { XStack, YStack, SizableText } from 'tamagui'
import { Heart } from '@tamagui/lucide-icons'
import { Comment } from '@/types/Comment'
import Avatar from '@/components/Avatar'
import { formatDate } from '@/utils/FormatDate'
import CommentOptionsSheet from './CommentOptionsSheet'
import CommentDeleteConfirmModal from './CommentDeleteConfirmModal'

type Props = {
  comment: Comment
  onLike: (id: string) => void
  onReply: (comment: Comment) => void
  onViewReplies: (commentId: string) => void
  onEdit?: (comment: Comment) => void
  onDelete?: (commentId: string) => void
  isReply?: boolean
  isExpanded?: boolean
  replyCount?: number
  likeCount?: number
  isLiked?: boolean
  currentUserId?: string
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 4,
  },
  mediaGridItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
})

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onViewReplies,
  onEdit,
  onDelete,
  isReply = false,
  isExpanded = false,
  replyCount = 0,
  likeCount = 0,
  isLiked = false,
  currentUserId,
}: Props) {
  const [showOptionsSheet, setShowOptionsSheet] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isOwner = currentUserId === comment.authorProfile?.id

  const hasMedia = comment.media && comment.media.length > 0
  const mediaCount = comment.media?.length || 0

  const useGridLayout = !isReply && mediaCount >= 2

  const renderMedia = () => {
    if (!hasMedia) return null

    if (useGridLayout) {
      const gridWidth = '48.5%'

      return (
        <YStack style={styles.mediaGrid}>
          {comment.media!.map((uri, index) => (
            <YStack
              key={index}
              style={[styles.mediaGridItem, { width: gridWidth }]}
            >
              <Image
                source={{ uri }}
                style={[styles.mediaImage, { height: 180 }]}
                resizeMode="cover"
              />
            </YStack>
          ))}
        </YStack>
      )
    } else {
      return (
        <YStack gap="$2" marginTop="$2">
          {comment.media!.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          ))}
        </YStack>
      )
    }
  }

  return (
    <>
      <Pressable
        onLongPress={() => {
          if (isOwner && (onEdit || onDelete)) {
            setShowOptionsSheet(true)
          }
        }}
        delayLongPress={400}
      >
        <YStack
          style={styles.container}
          paddingHorizontal="$3"
          marginVertical="$2"
        >
          <XStack gap="$3">
            <Avatar
              uri={comment.authorProfile?.avatarUrl || undefined}
              size={35}
            />

            <YStack flex={1} marginTop={-5} gap="$1">
              {/* Username and time */}
              <XStack alignItems="center" gap="$2">
                <SizableText fontSize={14} color="$color" fontWeight="600">
                  {comment.authorProfile?.username || 'Unknown User'}
                </SizableText>
                <SizableText fontSize={12} color="#888">
                  {formatDate(comment.createdAt)}
                </SizableText>
              </XStack>

              {/* Content */}
              {comment.content ? (
                <SizableText fontSize={14} lineHeight={18}>
                  {comment.content}
                </SizableText>
              ) : null}

              {/* Media */}
              {renderMedia()}

              {/* Actions */}
              <XStack alignItems="center" gap="$4" marginTop="$1">
                <TouchableOpacity onPress={() => onReply(comment)}>
                  <SizableText fontSize={13} fontWeight="600" color="#888">
                    Reply
                  </SizableText>
                </TouchableOpacity>

                {!isReply && replyCount > 0 && (
                  <TouchableOpacity onPress={() => onViewReplies(comment.id)}>
                    <SizableText fontSize={13} fontWeight="600" color="#888">
                      — {isExpanded ? 'Hide' : 'View'} replies ({replyCount})
                    </SizableText>
                  </TouchableOpacity>
                )}
              </XStack>
            </YStack>

            {/* Like button */}
            <YStack alignItems="center">
              <TouchableOpacity onPress={() => onLike(comment.id)}>
                <Heart
                  size={20}
                  color={isLiked ? '#ff4444' : '#888'}
                  fill={isLiked ? '#ff4444' : 'none'}
                />
              </TouchableOpacity>
              {likeCount > 0 && (
                <SizableText fontSize={13} fontWeight="600" color="#888">
                  {likeCount}
                </SizableText>
              )}
            </YStack>
          </XStack>
        </YStack>
      </Pressable>

      {/* Options Sheet */}
      <CommentOptionsSheet
        visible={showOptionsSheet}
        onClose={() => setShowOptionsSheet(false)}
        onEdit={() => {
          onEdit?.(comment)
        }}
        onDelete={() => {
          setShowDeleteConfirm(true)
        }}
      />

      {/* Delete Confirmation */}
      <CommentDeleteConfirmModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.(comment.id)
        }}
      />
    </>
  )
}
