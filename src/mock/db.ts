import { Post, User } from '../types/models'

const users: User[] = [
  {
    id: 'u1',
    username: 'hien.dev',
    name: 'Nguyen Hoang Hien',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'u2',
    username: 'pentoro.studio',
    name: 'Pentoro Studio',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'u1',
    username: 'hien.dev',
    name: 'Nguyen Hoang Hien',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'u2',
    username: 'pentoro.studio',
    name: 'Pentoro Studio',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'u1',
    username: 'hien.dev',
    name: 'Nguyen Hoang Hien',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'u2',
    username: 'pentoro.studio',
    name: 'Pentoro Studio',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
]

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
    ],
    caption: 'Carousel preview with 2 images.',
    likeCount: 987,
    commentCount: 62,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    liked: true,
    saved: false,
  },
]

export const stories = users.map((u, i) => ({
  id: `s${i + 1}`,
  author: u,
  thumbUrl: u.avatarUrl,
  hasNew: i % 2 === 0,
}))

export const notificationsData = [
  {
    id: 1,
    section: 'Today',
    avatar: 'https://i.pravatar.cc/150?img=5',
    message: 'Ms.chinh, B Ray and 2 others recently shared 5 posts.',
    time: '19h',
    unread: true,
    icon: 'book', // optional icon name
  },
  {
    id: 2,
    section: 'Earlier',
    avatar: 'https://i.pravatar.cc/150?img=15',
    message:
      'Thuan Vo commented on your post in Chợ GearVN 2nd: Logitech-Zowie-Hyperx-Razer...',
    time: '3d',
  },
  {
    id: 3,
    section: 'Earlier',
    avatar: 'https://i.pravatar.cc/150?img=10',
    message:
      "adidas posted a new reel: 'BÙNG NỔ SỰ KIỆN KHAI TRƯƠNG CỬA HÀNG HOME OF SPORTS VI...'",
    time: '4d',
    icon: 'youtube',
  },
  {
    id: 4,
    section: 'Earlier',
    avatar: 'https://i.pravatar.cc/150?img=3',
    message:
      'The Fire Monkey, a Page you recently viewed, invited you to join their private group Săn deal cùng...',
    time: '5d',
    actions: [
      { label: 'Join', type: 'primary' },
      { label: 'Delete', type: 'secondary' },
    ],
  },
]
