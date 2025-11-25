import React from 'react'
import { FlatList } from 'react-native'
import { YStack, SizableText, useTheme } from 'tamagui'
import { Comment } from '@/types/Comment'
import CommentCard from './CommentCard'

type Props = {
  comments: Comment[]
  expandedComments: Set<string>
  onLike: (commentId: string) => void
  onReply: (comment: Comment) => void
  onViewReplies: (commentId: string) => void
  currentUserId?: string
}

export default function CommentList({
  comments,
  expandedComments,
  onLike,
  onReply,
  onViewReplies,
  currentUserId,
}: Props) {
  const topLevelComments = comments.filter(c => !c.parentCommentId)
  const theme = useTheme()

  const getReplies = (commentId: string) => {
    return comments.filter(c => c.parentCommentId === commentId)
  }

  return (
    <FlatList
      style={{
        flex: 1,
        backgroundColor: theme.$backgroundModal?.val || '#fff',
      }}
      data={topLevelComments}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        const replies = getReplies(item.id)
        const isExpanded = expandedComments.has(item.id)
        const replyCount = replies.length
        const likeCount = item.likes?.length || 0
        const isLiked = item.likes?.includes(currentUserId || '') || false

        return (
          <YStack>
            <CommentCard
              comment={item}
              onLike={onLike}
              onReply={onReply}
              onViewReplies={onViewReplies}
              isExpanded={isExpanded}
              replyCount={replyCount}
              likeCount={likeCount}
              isLiked={isLiked}
            />
            {/* Render replies */}
            {replies.length > 0 && isExpanded && (
              <YStack paddingLeft={50}>
                {replies.map(reply => {
                  const replyLikeCount = reply.likes?.length || 0
                  const replyIsLiked =
                    reply.likes?.includes(currentUserId || '') || false
                  return (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      onLike={onLike}
                      onReply={onReply}
                      onViewReplies={onViewReplies}
                      isReply
                      likeCount={replyLikeCount}
                      isLiked={replyIsLiked}
                    />
                  )
                })}
              </YStack>
            )}
          </YStack>
        )
      }}
      contentContainerStyle={
        topLevelComments.length === 0
          ? { flex: 1, justifyContent: 'center' }
          : { paddingBottom: 0 }
      }
      ListEmptyComponent={
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          paddingVertical="$6"
        >
          <SizableText fontSize={15} color="#888">
            No comments yet
          </SizableText>
        </YStack>
      }
    />
  )
}
