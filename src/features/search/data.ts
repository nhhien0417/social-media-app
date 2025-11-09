export type SearchCategory = 'all' | 'posts' | 'users' | 'groups'

export interface BaseResult {
  id: string
  title: string
  description: string
  category: SearchCategory
}

export interface PostResult extends BaseResult {
  category: 'posts'
  author: string
  thumbnail?: string
  likes: number
  comments: number
}

export interface UserResult extends BaseResult {
  category: 'users'
  mutualFriends: number
  isFriend: boolean
}

export interface GroupResult extends BaseResult {
  category: 'groups'
  members: number
  isMember: boolean
}

export type SearchResult = PostResult | UserResult | GroupResult

export const searchMockData: SearchResult[] = [
  {
    id: 'post-1',
    category: 'posts',
    title: '10 travel photography hacks',
    description: 'A handful of Lightroom presets to brighten your next trip.',
    author: 'An Nguyen',
    thumbnail:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400',
    likes: 238,
    comments: 54,
  },
  {
    id: 'user-1',
    category: 'users',
    title: 'Linh Tran',
    description: 'Works at Designify • Lives in Ho Chi Minh City',
    mutualFriends: 12,
    isFriend: false,
  },
  {
    id: 'group-1',
    category: 'groups',
    title: 'Vietnam UX Collective',
    description: 'A hub for sharing UX design knowledge and resources.',
    members: 15430,
    isMember: false,
  },
  {
    id: 'post-2',
    category: 'posts',
    title: 'What a sunny day!',
    description: 'Let’s wake up early and go for a run together.',
    author: 'Hoang Phuc',
    thumbnail:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    likes: 89,
    comments: 21,
  },
  {
    id: 'user-2',
    category: 'users',
    title: 'Minh Anh',
    description: 'Studies Computer Science at UIT',
    mutualFriends: 4,
    isFriend: true,
  },
  {
    id: 'group-2',
    category: 'groups',
    title: 'Run Addicts Club',
    description: 'Lace up together and conquer new routes every week.',
    members: 8200,
    isMember: true,
  },
]

export interface SearchHistoryItem {
  id: string
  keyword: string
  timestamp: string
}

export const searchHistoryMock: SearchHistoryItem[] = [
  {
    id: 'history-1',
    keyword: 'Travel inspiration',
    timestamp: '2025-11-05T08:30:00.000Z',
  },
  {
    id: 'history-2',
    keyword: 'Running clubs near me',
    timestamp: '2025-11-04T19:12:00.000Z',
  },
  {
    id: 'history-3',
    keyword: 'UX design tips',
    timestamp: '2025-11-03T10:45:00.000Z',
  },
]
