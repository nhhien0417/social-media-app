import React from 'react'
import { FlatList } from 'react-native'
import { YStack, SizableText, useTheme } from 'tamagui'
import { Comment } from '@/types/Comment'
import CommentCard from './CommentCard'

type Props = {
  comments: Comment[]
  onLike: (commentId: string) => void
  onReply: (comment: Comment) => void
  onViewReplies: (commentId: string) => void
}

export default function CommentList({
  comments,
  onLike,
  onReply,
  onViewReplies,
}: Props) {
  const topLevelComments = comments.filter(c => !c.parentId)
  const theme = useTheme()

  return (
    <FlatList
      style={{
        flex: 1,
        backgroundColor: theme.$backgroundModal?.val || '#fff',
      }}
      data={topLevelComments}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <CommentCard
          comment={item}
          onLike={onLike}
          onReply={onReply}
          onViewReplies={onViewReplies}
        />
      )}
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
