import { memo } from 'react'
import { Clock, Search } from '@tamagui/lucide-icons'
import { Text, XStack, YStack, useThemeName } from 'tamagui'
import type { SearchHistoryItem } from '../../../mock/search'

interface SearchHistoryListProps {
  items: SearchHistoryItem[]
  onSelect: (keyword: string) => void
}

export const SearchHistoryList = memo(function SearchHistoryList({
  items,
  onSelect,
}: SearchHistoryListProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const iconColor = isDark ? 'rgba(255,255,255,0.65)' : '#6b7280'
  const keywordColor = isDark ? '#f5f5f5' : '#1f2937'
  const timestampColor = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280'

  if (!items.length) {
    return null
  }

  return (
    <YStack gap="$3">
      <Text fontSize="$5" fontWeight="600">
        Recent searches
      </Text>

      <YStack gap="$2">
        {items.map(item => (
          <XStack
            key={item.id}
            alignItems="center"
            gap="$3"
            paddingVertical="$2"
            paddingHorizontal="$2"
            borderRadius="$4"
            hoverStyle={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
            }}
            pressStyle={{ opacity: 0.7 }}
            onPress={() => onSelect(item.keyword)}
          >
            <Clock size={18} color={iconColor} />
            <YStack flex={1}>
              <Text fontSize="$4" color={keywordColor}>
                {item.keyword}
              </Text>
              <Text fontSize="$2" color={timestampColor}>
                {new Date(item.timestamp).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
            </YStack>
            <Search size={18} color={iconColor} />
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
})
