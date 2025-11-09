import { XStack, Button, useThemeName } from 'tamagui'
import type { SearchCategory } from './data'

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
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const activeBackground = '#1877F2'
  const inactiveBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const inactiveBorderColor = isDark ? 'rgba(255,255,255,0.2)' : '#d5dae1'
  const activeTextColor = '#ffffff'
  const inactiveTextColor = isDark ? 'rgba(255,255,255,0.85)' : '#1f2937'

  return (
    <XStack gap="$2" flexWrap="wrap">
      {FILTERS.map(filter => {
        const isActive = value === filter.value

        return (
          <Button
            key={filter.value}
            size="$3"
            borderRadius={999}
            paddingHorizontal="$4"
            backgroundColor={isActive ? activeBackground : inactiveBackground}
            color={isActive ? activeTextColor : inactiveTextColor}
            borderColor={isActive ? 'transparent' : inactiveBorderColor}
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
