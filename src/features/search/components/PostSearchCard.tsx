import { memo } from 'react'
import { Image, StyleSheet, Pressable } from 'react-native'
import { XStack, YStack, Text, useThemeName } from 'tamagui'
import { Heart, MessageCircle } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { Post } from '@/types/Post'
import { getAvatarUrl } from '@/utils/Avatar'
import { formatNumber } from '@/utils/FormatNumber'
import Avatar from '@/components/Avatar'

interface PostSearchCardProps {
  post: Post
}

export const PostSearchCard = memo(function PostSearchCard({
  post,
}: PostSearchCardProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const cardBackground = isDark ? '#1a1a1a' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  // Safe access to author profile with null checks
  const author = post.authorProfile
  const authorName = author.username || 'Unknown User'
  const authorAvatar =
    author?.avatarUrl || getAvatarUrl(author?.username || 'user')

  const thumbnail = post.media && post.media.length > 0 ? post.media[0] : null

  const handleNavigateToPost = () => {
    router.push(`/post/${post.id}`)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }

  return (
    <Pressable onPress={handleNavigateToPost}>
      <XStack
        padding="$3"
        margin="$2"
        backgroundColor={cardBackground}
        borderRadius={12}
        borderColor={borderColor}
        borderWidth={1}
        gap="$3"
      >
        {/* Thumbnail if available */}
        {thumbnail && (
          <YStack style={styles.thumbnail}>
            <Image
              source={{ uri: thumbnail }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          </YStack>
        )}

        <YStack flex={1} gap="$2">
          {/* Author info */}
          <XStack alignItems="center" gap="$2">
            <Avatar size={40} uri={authorAvatar || undefined} />

            <Text fontSize={15} fontWeight="600" color={textColor}>
              {authorName}
            </Text>
            {post.createdAt && (
              <Text fontSize={13} color={subtitleColor}>
                • {formatDate(post.createdAt)}
              </Text>
            )}
          </XStack>

          {/* Content preview */}
          {post.content && (
            <Text
              fontSize={14}
              color={textColor}
              numberOfLines={2}
              lineHeight={20}
            >
              {post.content}
            </Text>
          )}

          {/* Stats */}
          <XStack gap="$4" alignItems="center">
            <XStack alignItems="center" gap="$1.5">
              <Heart size={15} color={subtitleColor} />
              <Text fontSize={13} color={subtitleColor}>
                {formatNumber(post.likes?.length || 0)}
              </Text>
            </XStack>
            <XStack alignItems="center" gap="$1.5">
              <MessageCircle size={15} color={subtitleColor} />
              <Text fontSize={13} color={subtitleColor}>
                {formatNumber(post.commentsCount || 0)}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </XStack>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
})
