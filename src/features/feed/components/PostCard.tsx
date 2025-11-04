import { memo } from 'react'
import { YStack, XStack, Text, Image, Button } from 'tamagui'
import Avatar from '@/components/Avatar'
import { Post } from '@/types/models'
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from '@tamagui/lucide-icons'

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
        <Button chromeless circular size="$3" icon={MoreHorizontal} />
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
        <XStack gap="$3.5" alignItems="center">
          <Button chromeless icon={<Heart size={24} />} />
          <Button chromeless icon={<MessageCircle size={24} />} />
          <Button chromeless icon={<Send size={24} />} />
        </XStack>

        <Button chromeless icon={<Bookmark size={24} />} />
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
