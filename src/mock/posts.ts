import { Post } from '@/types/Post'
import { users } from './users'
export const posts: Post[] = [
  {
    id: 'p1',
    author: users[0],
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?1',
        ratio: 1080 / 1350,
      },
    ],
    caption: 'First mock post — UI first!',
    likeCount: 123,
    commentCount: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    liked: false,
    saved: false,
  },
  {
    id: 'p2',
    author: users[1],
    media: [
      {
        id: 'm2',
        type: 'image',
        url: 'https://picsum.photos/1080/1080?2',
        ratio: 1,
      },
      {
        id: 'm3',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?3',
        ratio: 1080 / 1350,
      },
      {
        id: 'm4',
        type: 'image',
        url: 'https://picsum.photos/1080/1080?4',
        ratio: 1,
      },
      {
        id: 'm5',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?5',
        ratio: 1080 / 1350,
      },
    ],
    caption: 'Carousel preview with 4 images.',
    likeCount: 987,
    commentCount: 62,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    liked: true,
    saved: false,
  },
  {
    id: 'p3',
    author: users[0],
    media: [
      {
        id: 'm6',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?6',
        ratio: 1080 / 1350,
      },
    ],
    caption: 'Another single post.',
    likeCount: 123,
    commentCount: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    liked: false,
    saved: false,
  },
  {
    id: 'p4',
    author: users[1],
    media: [
      {
        id: 'm7',
        type: 'image',
        url: 'https://picsum.photos/1080/1080?7',
        ratio: 1,
      },
      {
        id: 'm8',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?8',
        ratio: 1080 / 1350,
      },
    ],
    caption: 'Carousel preview with 2 images.',
    likeCount: 987,
    commentCount: 62,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    liked: true,
    saved: false,
  },
]
