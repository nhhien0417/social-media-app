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

export default function MediaGrid({
  items,
  isDark,
}: {
  items: Post[]
  isDark: boolean
}) {
  const rows = useMemo(() => chunkMedia(items), [items])
  const placeholderColor = isDark ? '#1f2937' : '#e5e7eb'

  if (!items.length) {
    return (
      <YStack
        paddingHorizontal="$3"
        paddingVertical="$6"
        alignItems="center"
        gap="$2"
      >
        <Text fontSize="$6" fontWeight="700">
          No posts yet
        </Text>
        <Text
          fontSize="$4"
          color={isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'}
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
          <XStack key={rowKey} gap="$1">
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
                <YStack
                  key={item.id}
                  flex={1}
                  aspectRatio={1}
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
              )
            })}
          </XStack>
        )
      })}
    </YStack>
  )
}
