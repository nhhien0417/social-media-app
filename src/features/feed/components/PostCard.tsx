import { memo, useState, useRef, useCallback, useEffect } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
} from 'react-native'
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
import Comment from '@/features/comment/Comment'
import { getUserId } from '@/utils/SecureStore'
import { usePostStore } from '@/stores/postStore'
import { router } from 'expo-router'
import PostOptionsSheet from './PostOptionsSheet'
import DeleteConfirmModal from './DeleteConfirmModal'
import { formatNumber } from '@/utils/FormatNumber'
import LikeListModal from '@/features/like/LikeListModal'

function MediaItem({ url, width }: { url: string; width: number }) {
  return <Image source={{ uri: url }} width={width} aspectRatio={1} />
}

function PaginationDots({
  mediaCount,
  activeIndex,
}: {
  mediaCount: number
  activeIndex: number
}) {
  if (mediaCount <= 1) return null
  return (
    <XStack
      justifyContent="center"
      alignItems="center"
      marginTop="$3"
      width="100%"
    >
      {Array.from({ length: mediaCount }).map((_, index) => (
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

function PostCard({
  post,
  isAdmin,
  onDeleteAsAdmin,
}: {
  post: Post
  isAdmin?: boolean
  onDeleteAsAdmin?: (postId: string) => void
}) {
  const { authorProfile: author, media = [], content, createdAt } = post

  if (!author) return null

  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const listRef = useRef<FlatList<string>>(null)

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const isLongCaption = !!content && content.length > 100

  const [commentSheetVisible, setCommentSheetVisible] = useState(false)
  const [optionsSheetVisible, setOptionsSheetVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [likeListVisible, setLikeListVisible] = useState(false)

  const isOwner = currentUserId === author.id

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
    await likePost(post.id, currentUserId)
  }

  const handleEdit = () => {
    router.push({
      pathname: '/create',
      params: { editPostId: post.id, mode: 'POST' },
    })
  }

  const handleDelete = () => {
    setDeleteModalVisible(true)
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
        <Pressable
          onPress={() => {
            if (currentUserId && author.id === currentUserId) {
              router.push('/(tabs)/profile')
            } else {
              router.push({
                pathname: '/profile/[id]',
                params: { id: author.id },
              })
            }
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <Avatar uri={author.avatarUrl || undefined} size={40} />
          <Text fontWeight="600" fontSize={15}>
            {author.username}
          </Text>
        </Pressable>
        <ButtonIcon
          Icon={MoreVertical}
          Size={20}
          onPress={() => setOptionsSheetVisible(true)}
        />
      </XStack>
      {/* Media carousel */}
      {media.length > 0 && (
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/post/[id]',
              params: { id: post.id },
            })
          }}
        >
          <YStack
            aspectRatio={1}
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
          >
            {containerWidth > 0 && (
              <FlatList
                ref={listRef}
                data={media}
                keyExtractor={(item, index) => `${post.id}-media-${index}`}
                renderItem={({ item }) => (
                  <MediaItem url={item} width={containerWidth} />
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
        </Pressable>
      )}
      {/* Dots */}
      <PaginationDots mediaCount={media.length} activeIndex={activeIndex} />
      {/* Caption */}
      {!!content && (
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/post/[id]',
              params: { id: post.id },
            })
          }}
        >
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
                onPress={e => {
                  e.stopPropagation()
                  setIsCaptionExpanded(true)
                }}
                suppressHighlighting
              >
                More
              </Text>
            )}

            {isLongCaption && isCaptionExpanded && (
              <Text
                color="#888"
                fontSize={14}
                onPress={e => {
                  e.stopPropagation()
                  setIsCaptionExpanded(false)
                }}
                suppressHighlighting
              >
                Less
              </Text>
            )}
          </YStack>
        </Pressable>
      )}

      {/* Actions */}
      <XStack
        paddingHorizontal="$1.5"
        justifyContent="space-between"
        alignItems="center"
      >
        <XStack alignItems="center" gap="$2">
          <XStack alignItems="center">
            <ButtonIcon
              Icon={Heart}
              Fill={isLiked}
              Color={isLiked ? '#ee4444' : '$color'}
              onPress={handleLikePost}
            />
            {post.likes && post.likes.length > 0 && (
              <Pressable onPress={() => setLikeListVisible(true)} hitSlop={10}>
                <Text fontSize={13} fontWeight="600" suppressHighlighting>
                  {formatNumber(post.likes.length)}
                </Text>
              </Pressable>
            )}
          </XStack>

          <XStack alignItems="center">
            <ButtonIcon
              Icon={MessageCircle}
              onPress={() => setCommentSheetVisible(true)}
            />
            {post.commentsCount > 0 && (
              <Text fontSize={13} fontWeight="600">
                {formatNumber(post.commentsCount)}
              </Text>
            )}
          </XStack>

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
        userAvatarUrl={author.avatarUrl || undefined}
      />

      <PostOptionsSheet
        visible={optionsSheetVisible}
        onClose={() => setOptionsSheetVisible(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        mode="POST"
        isOwner={isOwner}
        isAdmin={isAdmin}
        onDeleteAsAdmin={
          onDeleteAsAdmin ? () => onDeleteAsAdmin(post.id) : undefined
        }
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        postId={post.id}
        mode="POST"
        thumbnailUrl={media[0]}
      />

      <LikeListModal
        visible={likeListVisible}
        onClose={() => setLikeListVisible(false)}
        postId={post.id}
      />
    </YStack>
  )
}

export default memo(PostCard)
