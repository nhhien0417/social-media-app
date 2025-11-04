import { Post } from '@/types/Post'
import { users } from './users'

const longCaption =
  'Instagram thường giới hạn caption ban đầu ở 2 dòng, và người dùng phải nhấn vào "more" để xem phần còn lại. ' +
  'Sau khi nhấn "more", toàn bộ nội dung sẽ hiển thị và nút "more" sẽ chuyển thành "less". ' +
  'Chúng ta đang mô phỏng lại hành vi chính xác đó ở đây.'

export const posts: Post[] = [
  {
    id: 'p1',
    author: users[0],
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://picsum.photos/1080/1080?1',
        ratio: 1,
      },
    ],
    caption: 'Một post đơn giản với ảnh vuông.',
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
    caption: 'Carousel với 4 ảnh (vuông và dọc xen kẽ).',
    likeCount: 987,
    commentCount: 62,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    liked: true,
    saved: false,
  },
  {
    id: 'p5',
    author: users[0],
    media: [
      {
        id: 'm6',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?6',
        ratio: 1080 / 1350,
      },
      {
        id: 'm7',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?7',
        ratio: 1080 / 1350,
      },
      {
        id: 'm8',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?8',
        ratio: 1080 / 1350,
      },
    ],
    caption: 'Một carousel khác với 3 ảnh.',
    likeCount: 321,
    commentCount: 22,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    liked: false,
    saved: true,
  },
  {
    id: 'p6',
    author: users[1],
    media: [
      {
        id: 'm9',
        type: 'image',
        url: 'https://picsum.photos/1080/1080?9',
        ratio: 1,
      },
    ],
    caption: longCaption,
    likeCount: 555,
    commentCount: 40,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    liked: true,
    saved: true,
  },
  {
    id: 'p7',
    author: users[0],
    media: [
      {
        id: 'm10',
        type: 'image',
        url: 'https://picsum.photos/1080/1350?10',
        ratio: 1080 / 1350,
      },
    ],
    likeCount: 99,
    commentCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    liked: false,
    saved: false,
  },
]
