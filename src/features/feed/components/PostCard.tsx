import React, { memo } from 'react'
import { YStack, XStack, Text, Image, Button, Separator } from 'tamagui'
import Avatar from '@/components/Avatar'
import { Post } from '@/types/models'
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2 } from '@tamagui/lucide-icons'

function Action({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <Button chromeless size="$3" alignItems="center" justifyContent="center" gap="$2">
      <Icon size={18} />
      <Text opacity={0.8}>{label}</Text>
    </Button>
  )
}

function PostCard({ post }: { post: Post }) {
  const { author, media, caption, likeCount, commentCount } = post

  return (
    <YStack paddingHorizontal="$3" paddingVertical="$2" backgroundColor="white" marginBottom="$2">
      {/* Header */}
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" gap="$2">
          <Avatar uri={author.avatarUrl ?? ''} />
          <YStack>
            <Text fontWeight="700">{author.name ?? author.username}</Text>
            <Text fontSize={12} opacity={0.6}>
              {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </YStack>
        </XStack>
        <Button chromeless circular size="$3" icon={MoreHorizontal} />
      </XStack>

      {/* Caption */}
      {caption && <Text marginTop="$2">{caption}</Text>}

      {/* Media */}
      {media.map((m) => (
        <Image
          key={m.id}
          source={{ uri: m.url }}
          width="100%"
          height={260}
          borderRadius={3}
          marginTop="$2"
        />
      ))}

      {/* Stats */}
      <XStack marginTop="$2" alignItems="center" justifyContent="space-between">
        <Text opacity={0.7}>{likeCount.toLocaleString()} likes</Text>
        <Text opacity={0.7}>{commentCount.toLocaleString()} comments</Text>
      </XStack>

      <Separator marginVertical="$2" opacity={0.08} />

      {/* Actions */}
      <XStack justifyContent="space-between">
        <Action icon={ThumbsUp} label="Like" />
        <Action icon={MessageCircle} label="Comment" />
        <Action icon={Share2} label="Share" />
      </XStack>
    </YStack>
  )
}

export default memo(PostCard)
