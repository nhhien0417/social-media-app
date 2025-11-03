import { Post, User } from "../types/models";

const users: User[] = [
  { id: "u1", username: "hien.dev", name: "Nguyen Hoang Hien",
    avatarUrl: "https://i.pravatar.cc/150?img=1" },
  { id: "u2", username: "pentoro.studio", name: "Pentoro Studio",
    avatarUrl: "https://i.pravatar.cc/150?img=12" },
];

export const posts: Post[] = [
  {
    id: "p1",
    author: users[0],
    media: [
      { id: "m1", type: "image", url: "https://picsum.photos/1080/1350?1", ratio: 1080/1350 },
    ],
    caption: "First mock post — UI first!",
    likeCount: 123,
    commentCount: 14,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    liked: false,
    saved: false,
  },
  {
    id: "p2",
    author: users[1],
    media: [
      { id: "m2", type: "image", url: "https://picsum.photos/1080/1080?2", ratio: 1 },
      { id: "m3", type: "image", url: "https://picsum.photos/1080/1350?3", ratio: 1080/1350 },
    ],
    caption: "Carousel preview with 2 images.",
    likeCount: 987,
    commentCount: 62,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    liked: true,
    saved: false,
  },
];

export const stories = users.map((u, i) => ({
  id: `s${i+1}`,
  author: u,
  thumbUrl: u.avatarUrl,
  hasNew: i % 2 === 0,
}));
