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
  const { authorProfile: author, media = [], content, createdAt } = post

  if (!author) return null

  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const listRef = useRef<FlatList<Media>>(null)

  const mediaItems: Media[] = media.map((url, index) => ({
    id: `${post.id}-media-${index}`,
    type: 'image',
    url: url,
    ratio: 1,
  }))

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const isLongCaption = !!content && content.length > 100

  const [commentSheetVisible, setCommentSheetVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    getUserId().then(id => {
      setCurrentUserId(id)
      if (id && post.likes) {
        const isLikedByMe = post.likes.includes(id)
        setIsLiked(isLikedByMe)
      }
    })
  }, [post.likes])

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

  const likePost = usePostStore(state => state.likePost)
  const handleLikePost = async () => {
    if (!currentUserId) {
      console.error('User not found')
      return
    }
    await likePost({ postId: post.id, userId: currentUserId })
  }

  const handleSendComment = (content: string, parentId?: string) => {
    console.log('Send comment:', content, 'parentId:', parentId)
  }

  const handleLikeComment = (commentId: string) => {
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
          <Text fontWeight="600" fontSize={15}>
            {author.username}
          </Text>
        </XStack>
        <ButtonIcon Icon={MoreVertical} Size={20} />
      </XStack>

      {/* Media carousel */}
      {mediaItems.length > 0 && (
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
      )}

      {/* Dots */}
      <PaginationDots media={mediaItems} activeIndex={activeIndex} />

      {/* Caption */}
      {!!content && (
        <YStack paddingHorizontal="$3" marginTop="$3" paddingBottom="$2">
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

      {/* Actions */}
      <XStack
        paddingHorizontal="$1.5"
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
        comments={[]}
        onSendComment={handleSendComment}
        onLikeComment={handleLikeComment}
        userAvatarUrl={author.avatarUrl || undefined}
      />
    </YStack>
  )
}

export default memo(PostCard)
