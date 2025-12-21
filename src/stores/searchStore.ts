import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Post } from '@/types/Post'
import { Group } from '@/types/Group'
import { User } from '@/types/User'
import { SearchCategory, SearchHistoryItem } from '@/types/Search'
import { searchPostApi } from '@/api/api.post'
import { searchGroupApi } from '@/api/api.group'
import { searchUserApi } from '@/api/api.profile'

const SEARCH_HISTORY_KEY = '@search_history'
const MAX_HISTORY_ITEMS = 10

interface SearchState {
  // Query state
  query: string
  category: SearchCategory
  hasSubmitted: boolean

  // Results
  users: User[]
  groups: Group[]
  posts: Post[]

  // Loading states
  isSearching: boolean
  error: string | null

  // History
  history: SearchHistoryItem[]

  // Actions
  setQuery: (query: string) => void
  setCategory: (category: SearchCategory) => void
  searchAll: (keyword: string) => Promise<void>
  searchByCategory: (keyword: string, category: SearchCategory) => Promise<void>
  clearResults: () => void
  resetSearch: () => void

  // History actions
  loadHistory: () => Promise<void>
  addToHistory: (keyword: string) => Promise<void>
  removeFromHistory: (id: string) => Promise<void>
  clearHistory: () => Promise<void>

  // Reset
  reset: () => void
}

const initialState = {
  query: '',
  category: 'all' as SearchCategory,
  hasSubmitted: false,
  users: [],
  groups: [],
  posts: [],
  isSearching: false,
  error: null,
  history: [],
}

export const useSearchStore = create<SearchState>((set, get) => ({
  ...initialState,

  setQuery: (query: string) => {
    set({ query })
    if (!query.trim()) {
      get().resetSearch()
    }
  },

  setCategory: (category: SearchCategory) => {
    set({ category })
    const { query, hasSubmitted } = get()
    // Re-search with new category if already submitted
    if (hasSubmitted && query.trim()) {
      get().searchByCategory(query, category)
    }
  },

  searchAll: async (keyword: string) => {
    const trimmed = keyword.trim()
    if (!trimmed) return

    set({ isSearching: true, error: null, hasSubmitted: true, query: trimmed })

    try {
      // Call all 3 APIs in parallel
      const [usersRes, groupsRes, postsRes] = await Promise.all([
        searchUserApi(trimmed).catch(() => ({ data: [] })),
        searchGroupApi(trimmed).catch(() => ({ data: [] })),
        searchPostApi(trimmed).catch(() => ({ data: [] })),
      ])

      set({
        users: usersRes.data || [],
        groups: groupsRes.data || [],
        posts: postsRes.data || [],
        isSearching: false,
      })

      // Add to history
      get().addToHistory(trimmed)
    } catch (error) {
      console.error('Search error:', error)
      set({
        error: 'Failed to search. Please try again.',
        isSearching: false,
      })
    }
  },

  searchByCategory: async (keyword: string, category: SearchCategory) => {
    const trimmed = keyword.trim()
    if (!trimmed) return

    set({ isSearching: true, error: null, hasSubmitted: true, query: trimmed })

    try {
      if (category === 'all') {
        await get().searchAll(trimmed)
        return
      }

      let users: User[] = get().users
      let groups: Group[] = get().groups
      let posts: Post[] = get().posts

      switch (category) {
        case 'users': {
          const res = await searchUserApi(trimmed)
          users = res.data || []
          break
        }
        case 'groups': {
          const res = await searchGroupApi(trimmed)
          groups = res.data || []
          break
        }
        case 'posts': {
          const res = await searchPostApi(trimmed)
          posts = res.data || []
          break
        }
      }

      set({ users, groups, posts, isSearching: false })
    } catch (error) {
      console.error('Search error:', error)
      set({
        error: 'Failed to search. Please try again.',
        isSearching: false,
      })
    }
  },

  clearResults: () => {
    set({
      users: [],
      groups: [],
      posts: [],
      error: null,
    })
  },

  resetSearch: () => {
    set({
      query: '',
      category: 'all',
      hasSubmitted: false,
      users: [],
      groups: [],
      posts: [],
      isSearching: false,
      error: null,
    })
  },

  // History actions
  loadHistory: async () => {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        const history: SearchHistoryItem[] = JSON.parse(stored)
        set({ history })
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  },

  addToHistory: async (keyword: string) => {
    const { history } = get()
    const trimmed = keyword.trim().toLowerCase()

    // Remove duplicate if exists
    const filtered = history.filter(
      item => item.keyword.toLowerCase() !== trimmed
    )

    // Create new entry
    const newItem: SearchHistoryItem = {
      id: `history-${Date.now()}`,
      keyword: keyword.trim(),
      timestamp: new Date().toISOString(),
    }

    // Add to front and limit
    const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)

    set({ history: newHistory })

    // Persist
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  },

  removeFromHistory: async (id: string) => {
    const { history } = get()
    const newHistory = history.filter(item => item.id !== id)

    set({ history: newHistory })

    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Failed to update search history:', error)
    }
  },

  clearHistory: async () => {
    set({ history: [] })

    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.error('Failed to clear search history:', error)
    }
  },

  reset: () => {
    set(initialState)
  },
}))
