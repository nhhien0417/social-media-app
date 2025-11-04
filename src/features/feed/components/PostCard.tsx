import { memo } from 'react'
import { YStack, XStack, Text, Image } from 'tamagui'
import Avatar from '@/components/Avatar'
import { Post } from '@/types/models'
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from '@tamagui/lucide-icons'
import ButtonIcon from '@/components/IconButton'

function PostCard({ post }: { post: Post }) {
  const { author, media, caption, likeCount, commentCount } = post
  const location = 'Tokyo, Japan'

  return (
    <YStack backgroundColor="white" marginBottom="$2">
      {/* 1. Header */}
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$2.5"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" gap="$2.5">
          <Avatar uri={author.avatarUrl ?? ''} size={36} />
          <YStack>
            <Text fontWeight="700" fontSize={14}>
              {author.username}
            </Text>
            {/* Thêm Location nếu có */}
            {location && (
              <Text fontSize={12} opacity={0.7}>
                {location}
              </Text>
            )}
          </YStack>
        </XStack>

        <ButtonIcon Icon={MoreHorizontal} Size={20}></ButtonIcon>
      </XStack>

      {/* 2. Media */}
      {media.map(m => (
        <Image
          key={m.id}
          source={{ uri: m.url }}
          width="100%"
          aspectRatio={1}
        />
      ))}

      {/* 3. Actions */}
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$3"
        justifyContent="space-between"
        alignItems="center"
      >
        <XStack alignItems="center">
          <ButtonIcon Icon={Heart}></ButtonIcon>
          <ButtonIcon Icon={MessageCircle}></ButtonIcon>
          <ButtonIcon Icon={Send}></ButtonIcon>
        </XStack>

        <ButtonIcon Icon={Bookmark}></ButtonIcon>
      </XStack>

      {/* 4. Stats (Likes) */}
      <Text paddingHorizontal="$3" fontWeight="700" fontSize={14}>
        {likeCount.toLocaleString()} likes
      </Text>

      {/* 5. Caption */}
      {caption && (
        <Text paddingHorizontal="$3" marginTop="$1" paddingBottom="$3">
          <Text fontWeight="700" fontSize={14}>
            {author.username}
          </Text>
          <Text fontSize={14}> {caption}</Text>
        </Text>
      )}

      {/* "View all X comments" (tùy chọn) */}
      {commentCount > 0 && (
        <Text
          paddingHorizontal="$3"
          paddingBottom="$3"
          color="$gray10"
          fontSize={14}
        >
          View all {commentCount.toLocaleString()} comments
        </Text>
      )}
    </YStack>
  )
}

export default memo(PostCard)
