import { XStack, Button, useThemeName } from 'tamagui'
import type { SearchCategory } from '@/types/Search'
import { XStack, Button } from 'tamagui'
import type { SearchCategory } from '../../../mock/search'
import { useAppColors } from '@/theme'

interface SearchFiltersProps {
  value: SearchCategory
  onChange: (next: SearchCategory) => void
}

const FILTERS: Array<{ label: string; value: SearchCategory }> = [
  { label: 'All', value: 'all' },
  { label: 'Posts', value: 'posts' },
  { label: 'People', value: 'users' },
  { label: 'Groups', value: 'groups' },
]

export function SearchFilters({ value, onChange }: SearchFiltersProps) {
  const colors = useAppColors()

  return (
    <XStack gap="$2" flexWrap="wrap">
      {FILTERS.map(filter => {
        const isActive = value === filter.value

        return (
          <Button
            key={filter.value}
            size="$3"
            fontSize="$4"
            fontWeight="500"
            borderRadius={999}
            paddingHorizontal="$4"
            backgroundColor={isActive ? colors.accent : colors.backgroundTertiary}
            color={isActive ? '#FFFFFF' : colors.text}
            borderColor={isActive ? 'transparent' : colors.border}
            borderWidth={isActive ? 0 : 1}
            onPress={() => onChange(filter.value)}
            pressStyle={{ opacity: isActive ? 0.85 : 0.7 }}
          >
            {filter.label}
          </Button>
        )
      })}
    </XStack>
  )
}
