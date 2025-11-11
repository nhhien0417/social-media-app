import { users } from './users'

// Sample media URLs for stories
const sampleMediaUrls = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
]

export const stories = users.slice(0, 8).map((u, i) => ({
  id: `s${i + 1}`,
  author: u,
  thumbUrl: u.avatarUrl,
  hasNew: i % 2 === 0,
  stories: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
    (_, storyIndex) => ({
      id: `s${i + 1}-story${storyIndex + 1}`,
      mediaUrl: sampleMediaUrls[(i + storyIndex) % sampleMediaUrls.length],
      type: 'image' as const,
    })
  ),
}))
