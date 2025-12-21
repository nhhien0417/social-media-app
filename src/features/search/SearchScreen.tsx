import { useCallback, useEffect } from 'react'
import { ScrollView, RefreshControl } from 'react-native'
import { Input, Separator, Text, XStack, YStack, useThemeName } from 'tamagui'
import { Search, X as Clear } from '@tamagui/lucide-icons'
import { useSearchStore } from '@/stores/searchStore'
import { SearchFilters } from '@/features/search/components/SearchFilters'
import { SearchResults } from '@/features/search/components/SearchResults'
import { SearchHistoryList } from '@/features/search/components/SearchHistoryList'
import { PeopleYouMayKnow } from '@/features/search/components/PeopleYouMayKnow'

export default function SearchScreen() {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const {
    query,
    category,
    hasSubmitted,
    users,
    groups,
    posts,
    isSearching,
    history,
    setQuery,
    setCategory,
    searchAll,
    resetSearch,
    loadHistory,
    removeFromHistory,
    clearHistory,
  } = useSearchStore()

  const searchBarBackground = isDark ? 'rgba(255,255,255,0.08)' : '#f0f2f5'
  const searchBarBorder = isDark ? 'rgba(255,255,255,0.15)' : '#dfe1e6'
  const searchIconColor = isDark ? 'rgba(255,255,255,0.75)' : '#64748b'
  const placeholderColor = isDark ? 'rgba(255,255,255,0.6)' : '#8D949E'
  const inputTextColor = isDark ? '#f5f5f5' : '#1f2937'
  const clearButtonBackground = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'
  const clearIconColor = isDark ? 'rgba(255,255,255,0.8)' : '#4b5563'

  // Load history on mount
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleChangeQuery = useCallback(
    (value: string) => {
      setQuery(value)
    },
    [setQuery]
  )

  const performSearch = useCallback(
    (keyword?: string) => {
      const value = (keyword ?? query).trim()
      if (!value) return
      searchAll(value)
    },
    [query, searchAll]
  )

  const handleHistorySelect = useCallback(
    (keyword: string) => {
      performSearch(keyword)
    },
    [performSearch]
  )

  const handleClearQuery = useCallback(() => {
    resetSearch()
  }, [resetSearch])

  const handleRefresh = useCallback(() => {
    if (hasSubmitted && query.trim()) {
      searchAll(query)
    }
  }, [hasSubmitted, query, searchAll])

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? '#000000' : '#FAFAFA' }}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={
        hasSubmitted ? (
          <RefreshControl
            refreshing={isSearching}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#ffffff' : '#000000'}
          />
        ) : undefined
      }
    >
      <YStack gap="$3">
        {/* Header and Search Bar */}
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
                onPress={handleClearQuery}
              >
                <Clear size={18} color={clearIconColor} />
              </XStack>
            ) : null}
          </XStack>
        </YStack>

        {/* Search Results View */}
        {hasSubmitted ? (
          <>
            <SearchFilters value={category} onChange={setCategory} />

            <Separator />

            <SearchResults
              users={users}
              groups={groups}
              posts={posts}
              activeCategory={category}
              isLoading={isSearching}
            />
          </>
        ) : (
          <>
            {/* Search History */}
            <SearchHistoryList
              items={history}
              onSelect={handleHistorySelect}
              onRemove={removeFromHistory}
              onClearAll={clearHistory}
            />

            <Separator />

            {/* People You May Know */}
            <PeopleYouMayKnow />
          </>
        )}
      </YStack>
    </ScrollView>
  )
}
