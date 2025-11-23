import { memo, useState, useRef, useCallback, useEffect } from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { YStack, XStack, Text, Image, View } from 'tamagui'
import Avatar from '@/components/Avatar'
import { Post } from '@/types/Post'
import {
  MoreVertical,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from '@tamagui/lucide-icons'
import ButtonIcon from '@/components/IconButton'
import { formatDate } from '@/utils/FormatDate'
import { Media } from '@/types/Media'
import Comment from '@/features/comment/Comment'
import { comments } from '@/mock/comments'
import { getUserId } from '@/utils/SecureStore'
import { usePostStore } from '@/stores/postStore'

function MediaItem({ item, width }: { item: Media; width: number }) {
  return <Image source={{ uri: item.url }} width={width} aspectRatio={1} />
}

function PaginationDots({
  media,
  activeIndex,
}: {
  media: Media[]
  activeIndex: number
}) {
  if (media.length <= 1) return null
  return (
    <XStack
      justifyContent="center"
      alignItems="center"
      marginTop="$3"
      width="100%"
    >
      {media.map((_, index) => (
        <View
          key={index}
          width={6}
          height={6}
          borderRadius={3}
          marginHorizontal={2}
          backgroundColor={index === activeIndex ? '$primary' : '$borderColor'}
        />
      ))}
    </XStack>
  )
}

function PostCard({ post }: { post: Post }) {
  const { authorId: author, media = [], content, createdAt, likes } = post
  const location = 'Tokyo, Japan'

  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const listRef = useRef<FlatList<Media>>(null)

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const isLongCaption = !!content && content.length > 100

  const [commentSheetVisible, setCommentSheetVisible] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const { likePost: likePostStore } = usePostStore()

  // Convert media strings to Media objects if needed
  const mediaItems: Media[] = media.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `media-${post.id}-${index}`,
        type: 'image',
        url: item,
        ratio: 1,
      }
    }
    return item as any as Media
  })

  // Get current user ID on mount
  useEffect(() => {
    getUserId().then(setCurrentUserId)
  }, [])

  // Check if current user has liked this post
  const isLiked = currentUserId
    ? likes.some((like: any) => like.userId === currentUserId)
    : false

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const lmW = e.nativeEvent.layoutMeasurement?.width ?? 0
      const w = containerWidth || lmW || 1
      const x = e.nativeEvent.contentOffset.x
      const idx = Math.round(x / w)
      if (idx !== activeIndex) setActiveIndex(idx)
    },
    [activeIndex, containerWidth]
  )

  const handleLikePost = async () => {
    try {
      if (!currentUserId) {
        console.error('User not found')
        return
      }

      // Use store action for optimistic update
      await likePostStore(post.id, currentUserId)
    } catch (error) {
      console.error('Error like post:', error)
    }
  }

  const handleSendComment = (content: string, parentId?: string) => {
    // TODO: Implement send comment logic
    console.log('Send comment:', content, 'parentId:', parentId)
  }

  const handleLikeComment = (commentId: string) => {
    // TODO: Implement like comment logic
    console.log('Like comment:', commentId)
  }

  return (
    <YStack backgroundColor="$background">
      {/* Header */}
      <XStack
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" gap="$2.5">
          <Avatar uri={author.avatarUrl || undefined} size={40} />
          <YStack>
            <Text fontWeight="600" fontSize={15}>
              {author.username}
            </Text>
            {!!location && (
              <Text fontSize={12} opacity={0.75}>
                {location}
              </Text>
            )}
          </YStack>
        </XStack>
        <ButtonIcon Icon={MoreVertical} Size={20} />
      </XStack>

      {/* Media carousel */}
      <YStack
        aspectRatio={1}
        onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {containerWidth > 0 && (
          <FlatList
            ref={listRef}
            data={mediaItems}
            keyExtractor={it => it.id}
            renderItem={({ item }) => (
              <MediaItem item={item} width={containerWidth} />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        )}
      </YStack>

      {/* Dots */}
      <PaginationDots media={mediaItems} activeIndex={activeIndex} />

      {/* Actions */}
      <XStack
        paddingHorizontal="$1.5"
        paddingTop="$1"
        justifyContent="space-between"
        alignItems="center"
      >
        <XStack alignItems="center">
          <ButtonIcon
            Icon={Heart}
            Fill={isLiked}
            Color={isLiked ? '#ee4444' : '$color'}
            onPress={handleLikePost}
          />
          <ButtonIcon
            Icon={MessageCircle}
            onPress={() => setCommentSheetVisible(true)}
          />
          <ButtonIcon Icon={Send} />
        </XStack>
        <ButtonIcon Icon={Bookmark} />
      </XStack>

      {/* Caption */}
      {!!content && (
        <YStack paddingHorizontal="$3" marginTop="$1">
          <Text
            fontWeight="normal"
            fontSize={15}
            numberOfLines={isCaptionExpanded ? undefined : 2}
          >
            {content}
          </Text>

          {isLongCaption && !isCaptionExpanded && (
            <Text
              color="#888"
              fontSize={14}
              onPress={() => setIsCaptionExpanded(true)}
            >
              More
            </Text>
          )}

          {isLongCaption && isCaptionExpanded && (
            <Text
              color="#888"
              fontSize={14}
              onPress={() => setIsCaptionExpanded(false)}
            >
              Less
            </Text>
          )}
        </YStack>
      )}

      {/* Time */}
      <Text
        paddingHorizontal="$3"
        marginTop="$1"
        paddingBottom="$3"
        color="#888"
        fontSize={12}
      >
        {formatDate(createdAt)}
      </Text>

      {/* Comment Sheet */}
      <Comment
        visible={commentSheetVisible}
        onClose={() => setCommentSheetVisible(false)}
        postId={post.id}
        comments={comments.filter(c => c.postId === post.id)}
        onSendComment={handleSendComment}
        onLikeComment={handleLikeComment}
        userAvatarUrl={author.avatarUrl || undefined}
      />
    </YStack>
  )
}

export default memo(PostCard)
