import { create } from 'zustand'
import { Post } from '@/types/Post'
import { getFeedApi, likePostApi } from '@/api/api.post'

interface PostState {
  posts: Post[]
  seenPostIds: Set<string>
  loading: boolean
  error: string | null
  lastFetchTime: number | null

  // Actions
  fetchFeed: () => Promise<void>
  refreshFeed: () => Promise<void>
  likePost: (postId: string, userId: string) => Promise<void>
  markPostAsSeen: (postId: string) => void
  getUnseenPosts: () => Post[]
  clearError: () => void
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  seenPostIds: new Set<string>(),
  loading: false,
  error: null,
  lastFetchTime: null,

  fetchFeed: async () => {
    try {
      set({ loading: true, error: null })
      const response = await getFeedApi()

      if (response.data.error) {
        set({ error: response.data.error, loading: false })
        return
      }

      set({
        posts: response.data.data,
        loading: false,
        lastFetchTime: Date.now(),
      })
    } catch (error) {
      console.error('Error fetching feed:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch feed',
        loading: false,
      })
    }
  },

  refreshFeed: async () => {
    const state = get()
    // Reset seen posts on manual refresh
    set({ seenPostIds: new Set<string>() })
    await state.fetchFeed()
  },

  likePost: async (postId: string, userId: string) => {
    try {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likes.some(
              (like: any) => like.userId === userId
            )
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((like: any) => like.userId !== userId)
                : [...post.likes, { userId }],
            }
          }
          return post
        }),
      }))

      // API call
      const response = await likePostApi({ postId, userId })

      // Update with server response
      if (response.data.data) {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? response.data.data : post
          ),
        }))
      }
    } catch (error) {
      console.error('Error liking post:', error)
      // Revert optimistic update
      await get().fetchFeed()
    }
  },

  markPostAsSeen: (postId: string) => {
    set(state => ({
      seenPostIds: new Set(state.seenPostIds).add(postId),
    }))
  },

  getUnseenPosts: () => {
    const { posts, seenPostIds } = get()
    return posts.filter(post => !seenPostIds.has(post.id))
  },

  clearError: () => set({ error: null }),
}))
