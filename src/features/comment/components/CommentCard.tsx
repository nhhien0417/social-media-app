import React from 'react'
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import { XStack, YStack, SizableText } from 'tamagui'
import { Heart } from '@tamagui/lucide-icons'
import { Comment } from '@/types/Comment'
import Avatar from '@/components/Avatar'
import { formatDate } from '@/utils/FormatDate'

type Props = {
  comment: Comment
  onLike: (id: string) => void
  onReply: (comment: Comment) => void
  onViewReplies: (commentId: string) => void
  isReply?: boolean
  isExpanded?: boolean
  replyCount?: number
  likeCount?: number
  isLiked?: boolean
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
})

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onViewReplies,
  isReply = false,
  isExpanded = false,
  replyCount = 0,
  likeCount = 0,
  isLiked = false,
}: Props) {
  return (
    <YStack style={styles.container} paddingHorizontal="$3" marginVertical="$2">
      <XStack gap="$3">
        <Avatar uri={comment.author.avatarUrl || undefined} size={35} />

        <YStack flex={1} marginTop={-5} gap="$1">
          {/* Username and time */}
          <XStack alignItems="center" gap="$2">
            <SizableText fontSize={14} color="$color" fontWeight="600">
              {comment.author.username}
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
