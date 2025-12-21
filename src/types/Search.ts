export type SearchCategory = 'all' | 'posts' | 'users' | 'groups'

export interface SearchHistoryItem {
  id: string
  keyword: string
  timestamp: string
}
