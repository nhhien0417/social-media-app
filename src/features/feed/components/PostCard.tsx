import { memo, useState, useRef, useCallback } from 'react'
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { YStack, XStack, Text, Image, View } from 'tamagui'
import Avatar from '@/components/Avatar'
import { Post, Media } from '@/types/models'
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from '@tamagui/lucide-icons'
import ButtonIcon from '@/components/IconButton'

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
          backgroundColor={index === activeIndex ? '#3897f0' : '#d9d9d9'}
        />
      ))}
    </XStack>
  )
}

function PostCard({ post }: { post: Post }) {
  const { author, media, caption, createdAt } = post
  const location = 'Tokyo, Japan'

  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const listRef = useRef<FlatList<Media>>(null)

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

  return (
    <YStack backgroundColor="white">
      {/* Header */}
      <XStack
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" gap="$2.5">
          <Avatar uri={author.avatarUrl} size={40} />
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
        <ButtonIcon Icon={MoreHorizontal} Size={20} />
      </XStack>

      {/* Media carousel */}
      <YStack
        aspectRatio={1}
        onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {containerWidth > 0 && (
          <FlatList
            ref={listRef}
            data={media}
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
      <PaginationDots media={media} activeIndex={activeIndex} />

      {/* Actions */}
      <XStack
        paddingHorizontal="$2"
        paddingTop="$1"
        justifyContent="space-between"
        alignItems="center"
      >
        <XStack alignItems="center">
          <ButtonIcon Icon={Heart} />
          <ButtonIcon Icon={MessageCircle} />
          <ButtonIcon Icon={Send} />
        </XStack>
        <ButtonIcon Icon={Bookmark} />
      </XStack>

      {/* Caption */}
      {!!caption && (
        <Text paddingHorizontal="$3" marginTop="$1">
          <Text fontWeight="normal" fontSize={15}>
            {caption}
          </Text>
        </Text>
      )}

      <Text
        paddingHorizontal="$3"
        marginTop="$1"
        paddingBottom="$3"
        fontSize={12}
      >
        {createdAt}
      </Text>
    </YStack>
  )
}

export default memo(PostCard)
