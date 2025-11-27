export type ProfileTabKey = 'posts' | 'reels' | 'tagged'

export interface HighlightStory {
  id: string
  imageUrl: string
  text?: string
  timestamp: string
}

export interface ProfileHighlight {
  id: string
  label: string
  coverImage: string
  stories: HighlightStory[]
}

export interface ProfilePost {
  id: string
  imageUrl: string
  type: 'post' | 'reel' | 'tagged'
}

export interface ProfileUser {
  username: string
  bio: string
  link?: string
  avatarUrl: string
  isCurrentUser?: boolean
  email?: string
  stats: {
    posts: number
    followers: number
    following: number
  }
  highlights: ProfileHighlight[]
  posts: ProfilePost[]
  reels: ProfilePost[]
  tagged: ProfilePost[]
}

export const profileMock: ProfileUser = {
  username: 'travel.with.ava',
  bio: 'Capturing sunsets & city escapes ✈️📷\nDM for collaborations',
  link: 'www.avasumm.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  isCurrentUser: true,
  email: 'ava.summers@example.com',
  stats: {
    posts: 428,
    followers: 128000,
    following: 342,
  },
  highlights: [
    {
      id: 'highlight-1',
      label: 'Paris',
      coverImage:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200',
      stories: [
        {
          id: 'paris-1',
          imageUrl:
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          timestamp: '2024-01-15T10:30:00Z',
        },
        {
          id: 'paris-2',
          imageUrl:
            'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800',
          timestamp: '2024-01-15T14:20:00Z',
        },
        {
          id: 'paris-3',
          imageUrl:
            'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
          timestamp: '2024-01-15T18:45:00Z',
        },
      ],
    },
    {
      id: 'highlight-2',
      label: 'Tokyo',
      coverImage:
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200',
      stories: [
        {
          id: 'tokyo-1',
          imageUrl:
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
          timestamp: '2024-02-20T08:15:00Z',
        },
        {
          id: 'tokyo-2',
          imageUrl:
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          timestamp: '2024-02-20T12:30:00Z',
        },
      ],
    },
    {
      id: 'highlight-3',
      label: 'NYC',
      coverImage:
        'https://images.unsplash.com/photo-1527259217374-7a88816c1bb0?w=200',
      stories: [
        {
          id: 'nyc-1',
          imageUrl:
            'https://images.unsplash.com/photo-1527259217374-7a88816c1bb0?w=800',
          timestamp: '2024-03-10T16:00:00Z',
        },
        {
          id: 'nyc-2',
          imageUrl:
            'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
          timestamp: '2024-03-10T19:30:00Z',
        },
        {
          id: 'nyc-3',
          imageUrl:
            'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
          timestamp: '2024-03-11T09:00:00Z',
        },
      ],
    },
    {
      id: 'highlight-4',
      label: 'Lisbon',
      coverImage:
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200',
      stories: [
        {
          id: 'lisbon-1',
          imageUrl:
            'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
          timestamp: '2024-04-05T11:20:00Z',
        },
      ],
    },
  ],
  posts: Array.from({ length: 12 }).map((_, index) => ({
    id: `post-${index + 1}`,
    imageUrl: `https://source.unsplash.com/random/800x800?travel&sig=${index + 1}`,
    type: 'post',
  })),
  reels: Array.from({ length: 6 }).map((_, index) => ({
    id: `reel-${index + 1}`,
    imageUrl: `https://source.unsplash.com/random/800x800?city&sig=${index + 20}`,
    type: 'reel',
  })),
  tagged: Array.from({ length: 4 }).map((_, index) => ({
    id: `tagged-${index + 1}`,
    imageUrl: `https://source.unsplash.com/random/800x800?friends&sig=${index + 40}`,
    type: 'tagged',
  })),
}
