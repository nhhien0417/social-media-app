import { memo } from 'react'
import { Separator, Text, YStack, useThemeName } from 'tamagui'
import type {
  GroupResult,
  PostResult,
  SearchCategory,
  SearchResult,
  UserResult,
} from './data'
import { SearchResultCard } from './SearchResultCard'

interface SearchResultsProps {
  data: SearchResult[]
  activeCategory: SearchCategory
  onSendFriendRequest?: (result: UserResult) => void
  onJoinGroup?: (result: GroupResult) => void
  onOpenPost?: (result: PostResult) => void
}

const EMPTY_MESSAGES: Record<SearchCategory, string> = {
  all: 'No results found. Try a different keyword.',
  posts: 'No posts match your search right now.',
  users: 'No people match your search.',
  groups: 'No groups match your search.',
}

export const SearchResults = memo(function SearchResults({
  data,
  activeCategory,
  onJoinGroup,
  onOpenPost,
  onSendFriendRequest,
}: SearchResultsProps) {
  const themeName = useThemeName()
  const emptyDescriptionColor =
    themeName === 'dark' ? 'rgba(255,255,255,0.65)' : '#4b5563'

  if (!data.length) {
    return (
      <YStack alignItems="center" paddingVertical="$8" gap="$2">
        <Text fontSize="$5" fontWeight="600">
          No results
        </Text>
        <Text color={emptyDescriptionColor} textAlign="center">
          {EMPTY_MESSAGES[activeCategory]}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      {data.map((item, index) => (
        <YStack key={item.id} gap="$3">
          <SearchResultCard
            result={item}
            onJoinGroup={onJoinGroup}
            onOpenPost={onOpenPost}
            onSendFriendRequest={onSendFriendRequest}
          />
          {index < data.length - 1 ? <Separator /> : null}
        </YStack>
      ))}
    </YStack>
  )
})
