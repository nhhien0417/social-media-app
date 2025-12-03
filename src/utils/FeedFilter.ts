import { Post } from '@/types/Post'

export function feedFilter(
  posts: Post[],
  type: 'STORY' | 'POST',
  currentUserId: string | undefined
): Post[] {
  return posts
  if (!posts) return []

  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return posts.filter(post => {
    if (type === 'STORY') {
      const createdAt = new Date(post.createdAt)
      return createdAt >= twentyFourHoursAgo
    } else if (type === 'POST') {
      return !post.seenBy?.includes(currentUserId || '')
    }
    return true
  })
}
