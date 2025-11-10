import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
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
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onViewReplies,
  isReply = false,
  isExpanded = false,
}: Props) {
  return (
    <YStack style={styles.container} paddingHorizontal="$3" marginVertical="$2">
      <XStack gap="$3">
        <Avatar uri={comment.author.avatarUrl} size={35} />

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
          <SizableText fontSize={14} lineHeight={18}>
            {comment.content}
          </SizableText>

          {/* Actions */}
          <XStack alignItems="center" gap="$4" marginTop="$1">
            <TouchableOpacity onPress={() => onReply(comment)}>
              <SizableText fontSize={13} fontWeight="600" color="#888">
                Reply
              </SizableText>
            </TouchableOpacity>

            {!isReply && comment.replyCount > 0 && (
              <TouchableOpacity onPress={() => onViewReplies(comment.id)}>
                <SizableText fontSize={13} fontWeight="600" color="#888">
                  — {isExpanded ? 'Hide' : 'View'} replies ({comment.replyCount}
                  )
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
              color={comment.liked ? '#ff4444' : '#888'}
              fill={comment.liked ? '#ff4444' : 'none'}
            />
          </TouchableOpacity>
          {comment.likeCount > 0 && (
            <SizableText fontSize={13} fontWeight="600" color="#888">
              {comment.likeCount}
            </SizableText>
          )}
        </YStack>
      </XStack>
    </YStack>
  )
}
