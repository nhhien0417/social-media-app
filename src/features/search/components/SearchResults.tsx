import { memo } from 'react'
import { Spinner, Text, YStack, useThemeName } from 'tamagui'
import { Post } from '@/types/Post'
import { Group } from '@/types/Group'
import { User } from '@/types/User'
import type { SearchCategory } from '@/types/Search'
import { UserSearchCard } from './UserSearchCard'
import { GroupSearchCard } from './GroupSearchCard'
import { PostSearchCard } from './PostSearchCard'

interface SearchResultsProps {
  users: User[]
  groups: Group[]
  posts: Post[]
  activeCategory: SearchCategory
  isLoading?: boolean
}

const EMPTY_MESSAGES: Record<SearchCategory, string> = {
  all: 'No results found. Try a different keyword.',
  posts: 'No posts match your search right now.',
  users: 'No people match your search.',
  groups: 'No groups match your search.',
}

export const SearchResults = memo(function SearchResults({
  users,
  groups,
  posts,
  activeCategory,
  isLoading,
}: SearchResultsProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const emptyDescriptionColor = isDark ? 'rgba(255,255,255,0.65)' : '#4b5563'

  if (isLoading) {
    return (
      <YStack alignItems="center" paddingVertical="$8" gap="$3">
        <Spinner size="large" color={isDark ? '#ffffff' : '#000000'} />
        <Text color={emptyDescriptionColor}>Searching...</Text>
      </YStack>
    )
  }

  // Determine what to show based on category
  const showUsers = activeCategory === 'all' || activeCategory === 'users'
  const showGroups = activeCategory === 'all' || activeCategory === 'groups'
  const showPosts = activeCategory === 'all' || activeCategory === 'posts'

  const hasUsers = showUsers && users.length > 0
  const hasGroups = showGroups && groups.length > 0
  const hasPosts = showPosts && posts.length > 0

  const hasAnyResults = hasUsers || hasGroups || hasPosts

  if (!hasAnyResults) {
    return (
      <YStack alignItems="center" paddingVertical="$10" gap="$2">
        <Text fontSize="$7" fontWeight="600">
          No results
        </Text>
        <Text color={emptyDescriptionColor} textAlign="center">
          {EMPTY_MESSAGES[activeCategory]}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack gap="$1">
      {/* Users section */}
      {hasUsers && (
        <YStack>
          {activeCategory === 'all' && users.length > 0 && (
            <Text
              fontSize="$5"
              fontWeight="600"
              padding="$2"
              color={emptyDescriptionColor}
            >
              People
            </Text>
          )}
          {users.map(user => (
            <UserSearchCard key={user.id} user={user} />
          ))}
        </YStack>
      )}

      {/* Groups section */}
      {hasGroups && (
        <YStack>
          {activeCategory === 'all' && groups.length > 0 && (
            <Text
              fontSize="$5"
              fontWeight="600"
              padding="$2"
              color={emptyDescriptionColor}
            >
              Groups
            </Text>
          )}
          {groups.map(group => (
            <GroupSearchCard key={group.id} group={group} />
          ))}
        </YStack>
      )}

      {/* Posts section */}
      {hasPosts && (
        <YStack>
          {activeCategory === 'all' && posts.length > 0 && (
            <Text
              fontSize="$5"
              fontWeight="600"
              padding="$2"
              color={emptyDescriptionColor}
            >
              Posts
            </Text>
          )}
          {posts.map(post => (
            <PostSearchCard key={post.id} post={post} />
          ))}
        </YStack>
      )}
    </YStack>
  )
})
