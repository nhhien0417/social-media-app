import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import { XStack, YStack, SizableText } from 'tamagui'
import { Heart, MoreHorizontal } from '@tamagui/lucide-icons'
import { Comment } from '@/types/Comment'
import Avatar from '@/components/Avatar'
import { formatDate } from '@/utils/FormatDate'

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
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  optionsButton: {
    padding: 4,
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
  const [showOptions, setShowOptions] = useState(false)
  const isOwner = currentUserId === comment.authorProfile?.id

  return (
    <YStack style={styles.container} paddingHorizontal="$3" marginVertical="$2">
      <XStack gap="$3">
        <Avatar uri={comment.authorProfile?.avatarUrl || undefined} size={35} />

        <YStack flex={1} marginTop={-5} gap="$1">
          {/* Username and time */}
          <XStack alignItems="center" gap="$2" justifyContent="space-between">
            <XStack alignItems="center" gap="$2">
              <SizableText fontSize={14} color="$color" fontWeight="600">
                {comment.authorProfile.username}
              </SizableText>
              <SizableText fontSize={12} color="#888">
                {formatDate(comment.createdAt)}
              </SizableText>
            </XStack>
            {isOwner && (
              <TouchableOpacity
                onPress={() => setShowOptions(!showOptions)}
                style={styles.optionsButton}
              >
                <MoreHorizontal size={16} color="#888" />
              </TouchableOpacity>
            )}
          </XStack>

          {/* Options Menu */}
          {showOptions && isOwner && (
            <YStack
              backgroundColor="#f0f0f0"
              borderRadius={8}
              padding="$2"
              gap="$1"
              marginBottom="$2"
            >
              {onEdit && (
                <TouchableOpacity
                  onPress={() => {
                    onEdit(comment)
                    setShowOptions(false)
                  }}
                >
                  <SizableText fontSize={14} color="$color" padding="$1">
                    Edit
                  </SizableText>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  onPress={() => {
                    onDelete(comment.id)
                    setShowOptions(false)
                  }}
                >
                  <SizableText fontSize={14} color="#ff4444" padding="$1">
                    Delete
                  </SizableText>
                </TouchableOpacity>
              )}
            </YStack>
          )}

          {/* Content */}
          {comment.content ? (
            <SizableText fontSize={14} lineHeight={18}>
              {comment.content}
            </SizableText>
          ) : null}

          {/* Media */}
          {comment.media && comment.media.length > 0 && (
            <YStack gap="$2">
              {comment.media.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              ))}
            </YStack>
          )}

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
  )
}
