import { memo } from 'react'
import { Clock, Search, X } from '@tamagui/lucide-icons'
import { Text, XStack, YStack, useThemeName, Button } from 'tamagui'
import type { SearchHistoryItem } from '@/types/Search'
import { Pressable } from 'react-native'

interface SearchHistoryListProps {
  items: SearchHistoryItem[]
  onSelect: (keyword: string) => void
  onRemove?: (id: string) => void
  onClearAll?: () => void
}

export const SearchHistoryList = memo(function SearchHistoryList({
  items,
  onSelect,
  onRemove,
  onClearAll,
}: SearchHistoryListProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const iconColor = isDark ? 'rgba(255,255,255,0.65)' : '#6b7280'
  const keywordColor = isDark ? '#f5f5f5' : '#1f2937'
  const timestampColor = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280'
  const hoverBackground = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'

  if (!items.length) {
    return null
  }

  return (
    <YStack>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" fontWeight="700">
          Recent searches
        </Text>
        {onClearAll && items.length > 0 && (
          <Pressable onPress={onClearAll}>
            <Text fontSize={14} color="#0095F6" fontWeight="600">
              Clear all
            </Text>
          </Pressable>
        )}
      </XStack>

      <YStack>
        {items.map(item => (
          <XStack
            key={item.id}
            alignItems="center"
            gap="$3"
            padding="$2"
            borderRadius="$4"
            hoverStyle={{
              backgroundColor: hoverBackground,
            }}
            pressStyle={{ opacity: 0.7 }}
            onPress={() => onSelect(item.keyword)}
          >
            <Clock size={22} color={iconColor} />
            <YStack flex={1}>
              <Text fontSize="$5" color={keywordColor}>
                {item.keyword}
              </Text>
              <Text fontSize="$3" color={timestampColor}>
                {new Date(item.timestamp).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
            </YStack>
            {onRemove ? (
              <XStack
                padding="$2"
                borderRadius={999}
                pressStyle={{ opacity: 0.6 }}
                onPress={e => {
                  e.stopPropagation()
                  onRemove(item.id)
                }}
              >
                <X size={16} color={iconColor} />
              </XStack>
            ) : (
              <Search size={18} color={iconColor} />
            )}
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
})
