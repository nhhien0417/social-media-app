import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Input, Separator, Text, XStack, YStack, useThemeName } from 'tamagui'
import { Search, X as Clear } from '@tamagui/lucide-icons'
import {
  searchMockData,
  searchHistoryMock,
  type GroupResult,
  type PostResult,
  type SearchCategory,
  type SearchResult,
  type SearchHistoryItem,
  type UserResult,
} from '@/features/search/data'
import { SearchFilters } from '@/features/search/SearchFilters'
import { SearchResults } from '@/features/search/SearchResults'
import { SearchHistoryList } from '@/features/search/components/SearchHistoryList'
import { PeopleYouMayKnow } from '@/features/search/components/PeopleYouMayKnow'

export default function SearchTabScreen() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SearchCategory>('all')
  const [results, setResults] = useState<SearchResult[]>(searchMockData)
  const [history, setHistory] = useState<SearchHistoryItem[]>(searchHistoryMock)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const searchBarBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f0f2f5'
  const searchBarBorder = isDark ? 'rgba(255,255,255,0.15)' : '#dfe1e6'
  const searchIconColor = isDark ? 'rgba(255,255,255,0.75)' : '#64748b'
  const placeholderColor = isDark ? 'rgba(255,255,255,0.6)' : '#8D949E'
  const inputTextColor = isDark ? '#f5f5f5' : '#1f2937'
  const clearButtonBackground = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'
  const clearIconColor = isDark ? 'rgba(255,255,255,0.8)' : '#4b5563'
  const pageBackground = isDark ? '#111418' : '#ffffff'

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return results.filter(result => {
      const matchesCategory =
        category === 'all' ? true : result.category === category

      if (!matchesCategory) return false

      if (!normalizedQuery) return true

      return (
        result.title.toLowerCase().includes(normalizedQuery) ||
        result.description.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [results, category, query])

  const handleFriendRequest = (user: UserResult) => {
    setResults(prev =>
      prev.map(item =>
        item.id === user.id && item.category === 'users'
          ? { ...item, isFriend: true }
          : item
      )
    )
  }

  const handleJoinGroup = (group: GroupResult) => {
    setResults(prev =>
      prev.map(item =>
        item.id === group.id && item.category === 'groups'
          ? { ...item, isMember: true }
          : item
      )
    )
  }

  const handleOpenPost = (_post: PostResult) => {
    // TODO: Navigate to post detail screen
  }

  const clearQuery = () => setQuery('')
  const resetToLanding = () => {
    setHasSubmitted(false)
    setCategory('all')
  }

  const handleChangeQuery = (value: string) => {
    setQuery(value)
    if (!value.trim()) {
      resetToLanding()
    }
  }

  const performSearch = (keyword?: string) => {
    const value = (keyword ?? query).trim()
    if (!value) {
      return
    }

    setQuery(value)
    setHasSubmitted(true)
    setCategory('all')

    setHistory(prev => {
      const withoutDuplicate = prev.filter(
        item => item.keyword.toLowerCase() !== value.toLowerCase()
      )
      const nextEntry: SearchHistoryItem = {
        id: `history-${Date.now()}`,
        keyword: value,
        timestamp: new Date().toISOString(),
      }
      return [nextEntry, ...withoutDuplicate].slice(0, 6)
    })
  }

  const handleHistorySelect = (keyword: string) => {
    performSearch(keyword)
  }

  return (
    <ScrollView
      style={{ backgroundColor: pageBackground }}
      contentContainerStyle={{ padding: 12 }}
    >
      <YStack gap="$3">
        <YStack gap="$2">
          <Text fontSize="$7" fontWeight="700">
            Search
          </Text>
          <XStack
            alignItems="center"
            backgroundColor={searchBarBackground}
            borderRadius={999}
            paddingHorizontal="$3"
            height={44}
            borderWidth={1}
            borderColor={searchBarBorder}
            gap="$2"
          >
            <XStack
              padding="$1"
              borderRadius={999}
              pressStyle={{ opacity: 0.7 }}
              onPress={() => performSearch()}
            >
              <Search size={18} color={searchIconColor} />
            </XStack>
            <Input
              flex={1}
              borderWidth={0}
              backgroundColor="transparent"
              placeholder="Search on Social App"
              value={query}
              onChangeText={handleChangeQuery}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={placeholderColor}
              color={inputTextColor}
              onSubmitEditing={() => performSearch()}
              returnKeyType="search"
            />
            {query ? (
              <XStack
                padding="$2"
                borderRadius={999}
                backgroundColor={clearButtonBackground}
                pressStyle={{ opacity: 0.6 }}
                onPress={() => {
                  clearQuery()
                  resetToLanding()
                }}
              >
                <Clear size={18} color={clearIconColor} />
              </XStack>
            ) : null}
          </XStack>
        </YStack>

        {hasSubmitted ? (
          <>
            <SearchFilters value={category} onChange={setCategory} />

            <Separator />

            <SearchResults
              data={filteredResults}
              activeCategory={category}
              onSendFriendRequest={handleFriendRequest}
              onJoinGroup={handleJoinGroup}
              onOpenPost={handleOpenPost}
            />
          </>
        ) : (
          <>
            <SearchHistoryList items={history} onSelect={handleHistorySelect} />

            <Separator />

            <PeopleYouMayKnow />
          </>
        )}
      </YStack>
    </ScrollView>
  )
}
