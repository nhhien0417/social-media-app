import { memo } from 'react'
import { ScrollView } from 'react-native'
import { Text, YStack, useThemeName } from 'tamagui'
import { Avatar, AvatarFallback, AvatarImage } from 'tamagui'
import type { ProfileHighlight } from './data'

interface StoryHighlightsProps {
  highlights: ProfileHighlight[]
}

export const StoryHighlights = memo(function StoryHighlights({
  highlights,
}: StoryHighlightsProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const labelColor = isDark ? 'rgba(255,255,255,0.8)' : '#111827'
  const fallbackBackground = isDark ? '#1f2937' : '#e5e7eb'

  if (!highlights.length) {
    return null
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 16 }}
    >
      {highlights.map(item => (
        <YStack key={item.id} alignItems="center" gap="$2">
          <Avatar size="$6" borderWidth={2} borderColor="#d1d5db">
            <AvatarImage src={item.coverImage} alt={item.label} />
            <AvatarFallback backgroundColor={fallbackBackground}>
              <Text fontSize="$3" fontWeight="600">
                {item.label[0]?.toUpperCase() ?? 'S'}
              </Text>
            </AvatarFallback>
          </Avatar>
          <Text fontSize="$2" color={labelColor}>
            {item.label}
          </Text>
        </YStack>
      ))}
    </ScrollView>
  )
})
