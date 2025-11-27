import { Post } from '@/types/Post'
import { useMemo } from 'react'
import { YStack, XStack, Text, Image } from 'tamagui'

const chunkMedia = (items: Post[]) => {
  const rows: Post[][] = []
  for (let index = 0; index < items.length; index += 3) {
    rows.push(items.slice(index, index + 3))
  }
  return rows
}

import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

export default function MediaGrid({
  items,
  isDark,
  userId,
}: {
  items: Post[]
  isDark: boolean
  userId?: string
}) {
  const router = useRouter()
  const rows = useMemo(() => chunkMedia(items), [items])
  const placeholderColor = isDark ? '#1f2937' : '#e5e7eb'

  const handleDisplayFeed = (item: Post) => {
    const targetUserId = item.authorProfile?.id || userId
    if (!targetUserId) {
      console.error('Missing user ID for post navigation')
      return
    }
    router.push({
      pathname: '/profile/feed',
      params: {
        initialPostId: item.id,
        userId: targetUserId,
      },
    })
  }

  if (!items.length) {
    return (
      <YStack
        paddingHorizontal="$3"
        paddingVertical="$8"
        alignItems="center"
        gap="$3"
      >
        <Text
          fontSize="$7"
          fontWeight="700"
          color={isDark ? '#f5f5f5' : '#111827'}
          textAlign="center"
        >
          No posts yet
        </Text>
        <Text
          fontSize="$4"
          color={isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'}
          textAlign="center"
          paddingHorizontal="$4"
        >
          Once you share photos and reels, they will appear here.
        </Text>
      </YStack>
    )
  }

  return (
    <YStack gap="$1">
      {rows.map((row, rowIndex) => {
        const paddedRow: Array<Post | null> = [...row]
        while (paddedRow.length < 3) {
          paddedRow.push(null)
        }

        const rowKey =
          row.map(item => item.id).join('-') || `empty-row-${rowIndex}`

        return (
          <XStack key={rowKey} gap="$1" flex={1}>
            {paddedRow.map((item, columnIndex) => {
              if (!item) {
                return (
                  <YStack
                    key={`placeholder-${rowKey}-${columnIndex}`}
                    flex={1}
                    aspectRatio={1}
                  />
                )
              }

              const imageUrl = item.media?.[0]
              return (
                <YStack key={item.id} flex={1} aspectRatio={1}>
                  <Pressable
                    style={{ width: '100%', height: '100%' }}
                    onPress={() => {
                      handleDisplayFeed(item)
                    }}
                  >
                    <YStack
                      width="100%"
                      height="100%"
                      overflow="hidden"
                      borderRadius="$3"
                      backgroundColor={placeholderColor}
                    >
                      {imageUrl && (
                        <Image
                          source={{ uri: imageUrl }}
                          width="100%"
                          height="100%"
                        />
                      )}
                    </YStack>
                  </Pressable>
                </YStack>
              )
            })}
          </XStack>
        )
      })}
    </YStack>
  )
}
