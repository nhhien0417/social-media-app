import { memo, useState, useRef, useCallback, useEffect } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native'
import { YStack, XStack, Text, View, Image } from 'tamagui'
import Avatar from '@/components/Avatar'
import {
  X,
  MoreVertical,
  Heart,
  MessageCircle,
  Send,
} from '@tamagui/lucide-icons'
import ButtonIcon from '@/components/IconButton'
import { formatDate } from '@/utils/FormatDate'
import Comment from '@/features/comment/Comment'
import { getUserId } from '@/utils/SecureStore'
import { usePostStore } from '@/stores/postStore'
import { router, useLocalSearchParams } from 'expo-router'
import { useProfileStore } from '@/stores/profileStore'
import PostOptionsSheet from './components/PostOptionsSheet'
import DeleteConfirmModal from './components/DeleteConfirmModal'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

function MediaItem({ url }: { url: string }) {
  return (
    <View
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      justifyContent="center"
      alignItems="center"
    >
      <Image
        source={{ uri: url }}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        }}
        resizeMode="contain"
      />
    </View>
  )
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
      width="100%"
      position="absolute"
      bottom={20}
      zIndex={5}
    >
      {Array.from({ length: mediaCount }).map((_, index) => (
        <View
          key={index}
          width={6}
          height={6}
          borderRadius={3}
          marginHorizontal={2}
          backgroundColor={
            index === activeIndex ? 'white' : 'rgba(255,255,255,0.5)'
          }
        />
      ))}
    </XStack>
  )
}

function PostDetailScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>()
  const posts = usePostStore(state => state.posts)
  const users = useProfileStore(state => state.users)
  const currentUser = useProfileStore(state => state.currentUser)

  // Find post in postStore or profileStore
  let post = posts.find(p => p.id === postId)
  if (!post) {
    for (const userId in users) {
      const user = users[userId]
      if (user.posts) {
        const foundPost = user.posts.find(p => p.id === postId)
        if (foundPost) {
          post = foundPost
          break
        }
      }
    }
    if (!post && currentUser?.posts) {
      post = currentUser.posts.find(p => p.id === postId)
    }
  }

  if (!post) {
    return (
      <YStack
        flex={1}
        backgroundColor="#000"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="white">Post not found</Text>
      </YStack>
    )
  }

  const { authorProfile: author, media = [], content, createdAt } = post

  if (!author) return null

  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<FlatList<string>>(null)
  const [isUIVisible, setIsUIVisible] = useState(true)
  const fadeAnim = useRef(new Animated.Value(1)).current

  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const isLongCaption = !!content && content.length > 100

  const [commentSheetVisible, setCommentSheetVisible] = useState(false)
  const [optionsSheetVisible, setOptionsSheetVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

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
      const x = e.nativeEvent.contentOffset.x
      const width = e.nativeEvent.layoutMeasurement.width
      const idx = Math.round(x / width)
      if (idx !== activeIndex) setActiveIndex(idx)
    },
    [activeIndex]
  )

  const toggleUI = useCallback(() => {
    const toValue = isUIVisible ? 0 : 1
    setIsUIVisible(!isUIVisible)
    Animated.timing(fadeAnim, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isUIVisible, fadeAnim])

  const likePost = usePostStore(state => state.likePost)
  const handleLikePost = async () => {
    if (!currentUserId) return
    setIsLiked(!isLiked)
    await likePost({ postId: post.id, userId: currentUserId })
  }

  const handleSendComment = (content: string, parentId?: string) => {
    console.log('Send comment:', content, 'parentId:', parentId)
  }

  const handleLikeComment = (commentId: string) => {
    console.log('Like comment:', commentId)
  }

  const handleEdit = () => {
    router.push({
      pathname: '/create',
      params: { editPostId: post.id },
    })
  }

  const handleDelete = () => {
    setDeleteModalVisible(true)
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Expanded Background Overlay */}
      {isCaptionExpanded && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="#00000088"
          zIndex={10}
        />
      )}

      {/* Header */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          zIndex: 20,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <XStack padding="$3" alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <X size={28} color="white" />
          </Pressable>
          <ButtonIcon
            Icon={MoreVertical}
            Size={24}
            Color="white"
            onPress={() => setOptionsSheetVisible(true)}
          />
        </XStack>
      </Animated.View>

      {/* Media carousel or Text-only view */}
      <Pressable
        onPress={toggleUI}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <YStack
          flex={1}
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          backgroundColor={media.length === 0 ? '#1a1a1a' : 'black'}
        >
          {media.length > 0 ? (
            <>
              <FlatList
                ref={listRef}
                data={media}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${post.id}-media-${index}`}
                renderItem={({ item }) => <MediaItem url={item} />}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                style={{ width: SCREEN_WIDTH, flex: 1 }}
              />
              <PaginationDots
                mediaCount={media.length}
                activeIndex={activeIndex}
              />
            </>
          ) : (
            <YStack
              padding="$4"
              justifyContent="center"
              alignItems="center"
              flex={1}
              width="100%"
            >
              <Text
                color="white"
                fontSize={24}
                fontWeight="bold"
                textAlign="center"
                lineHeight={32}
                numberOfLines={undefined}
                style={{ width: '100%' }}
              >
                {content}
              </Text>
            </YStack>
          )}
        </YStack>
      </Pressable>

      {/* Footer */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          zIndex: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <YStack padding="$3" gap="$2.5">
          {/* Author */}
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
            <Text fontWeight="600" fontSize={15} color="white">
              {author.username}
            </Text>
          </Pressable>

          {/* Caption */}
          {content && media.length > 0 && (
            <Pressable
              onPress={e => {
                e.stopPropagation()
                if (isLongCaption) {
                  setIsCaptionExpanded(!isCaptionExpanded)
                }
              }}
            >
              <YStack>
                <Text
                  color="white"
                  fontSize={14}
                  numberOfLines={isCaptionExpanded ? undefined : 2}
                >
                  {content}
                </Text>
              </YStack>
            </Pressable>
          )}

          {/* Likes + Timestamp */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text color="white" fontWeight="600" fontSize={14}>
              {post.likes.length.toLocaleString()} likes
            </Text>
            <Text color="white" fontSize={12}>
              {formatDate(createdAt)}
            </Text>
          </XStack>

          {/* Actions */}
          <XStack
            gap="$5"
            paddingTop="$2"
            borderTopWidth={1}
            borderTopColor="white"
          >
            <Pressable onPress={handleLikePost} hitSlop={8}>
              <Heart
                size={26}
                color={isLiked ? '#ff3b3b' : 'white'}
                fill={isLiked ? '#ff3b3b' : 'none'}
              />
            </Pressable>
            <Pressable onPress={() => setCommentSheetVisible(true)} hitSlop={8}>
              <MessageCircle size={26} color="white" />
            </Pressable>
            <Pressable hitSlop={8}>
              <Send size={26} color="white" />
            </Pressable>
          </XStack>
        </YStack>
      </Animated.View>

      {/* Comment Sheet */}
      <Comment
        visible={commentSheetVisible}
        onClose={() => setCommentSheetVisible(false)}
        postId={post.id}
        comments={[]}
        onSendComment={handleSendComment}
        onLikeComment={handleLikeComment}
      />

      <PostOptionsSheet
        visible={optionsSheetVisible}
        onClose={() => setOptionsSheetVisible(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isOwner={isOwner}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        postId={post.id}
        thumbnailUrl={media[0]}
      />
    </YStack>
  )
}

export default memo(PostDetailScreen)
