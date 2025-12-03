import { create } from 'zustand'
import { Post } from '@/types/Post'
import { User } from '@/types/User'
import {
  getFeedApi,
  getPostDetailApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  likePostApi,
  getUserLikesApi,
  seenPostApi,
  getUserSeenApi,
  CreatePostRequest,
  CreatePostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from '@/api/api.post'
import {
  addPostToStores,
  updatePostWithSnapshot,
  deletePostFromStores,
  toggleLikeInStores,
  restorePostSnapshot,
  addSeenToStores,
} from '@/utils/SyncPosts'
import { getUserId } from '@/utils/SecureStore'
import { feedFilter } from '@/utils/FeedFilter'

const BATCH_FLUSH_DELAY = 3000
const seenPostsCache = new Set<string>()
let seenPendingBatch: Map<string, string> = new Map()
let batchTimer: NodeJS.Timeout | null = null

interface PostState {
  // State
  posts: Post[]
  stories: Post[]
  currentPost: Post | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Actions
  fetchPosts: () => Promise<void>
  refreshPosts: () => Promise<void>
  fetchStories: () => Promise<void>
  refreshStories: () => Promise<void>
  getPostDetail: (postId: string) => Promise<void>

  createPost: (data: CreatePostRequest) => Promise<CreatePostResponse>
  updatePost: (data: UpdatePostRequest) => Promise<UpdatePostResponse>
  deletePost: (postId: string) => Promise<void>
  likePost: (postId: string, userId: string) => Promise<void>
  getUserLikes: (postId: string) => Promise<User[]>
  seenPost: (postId: string, userId: string) => void
  getUserSeen: (postId: string) => Promise<User[]>
  flushSeenBatch: () => Promise<void>
}

export const usePostStore = create<PostState>((set, get) => ({
  // Initial State
  posts: [],
  stories: [],
  currentPost: null,
  isLoading: false,
  isRefreshing: false,
  error: null,

  // Actions
  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getFeedApi('POST')
      console.log('Successful fetch posts:', response)

      const currentUserId = await getUserId()
      const filteredPosts = feedFilter(
        response.data.posts,
        'POST',
        currentUserId || undefined
      )

      set({ posts: filteredPosts, isLoading: false })
    } catch (error) {
      console.error('Error fetching posts:', error)
      set({ error: 'Failed to fetch posts', isLoading: false })
    }
  },

  refreshPosts: async () => {
    set({ isRefreshing: true, error: null })
    try {
      const response = await getFeedApi('POST')
      console.log('Successful refresh posts:', response)

      const currentUserId = await getUserId()
      const filteredPosts = feedFilter(
        response.data.posts,
        'POST',
        currentUserId || undefined
      )

      set({ posts: filteredPosts, isRefreshing: false })
    } catch (error) {
      console.error('Error refreshing posts:', error)
      set({ error: 'Failed to refresh posts', isRefreshing: false })
    }
  },

  fetchStories: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getFeedApi('STORY')
      console.log('Successful fetch stories:', response)

      const currentUserId = await getUserId()
      const filteredStories = feedFilter(
        response.data.posts,
        'STORY',
        currentUserId || undefined
      )

      set({ stories: filteredStories, isLoading: false })
    } catch (error) {
      console.error('Error fetching stories:', error)
      set({ error: 'Failed to fetch stories', isLoading: false })
    }
  },

  refreshStories: async () => {
    set({ isRefreshing: true, error: null })
    try {
      const response = await getFeedApi('STORY')
      console.log('Successful refresh stories:', response)

      const currentUserId = await getUserId()
      const filteredStories = feedFilter(
        response.data.posts,
        'STORY',
        currentUserId || undefined
      )

      set({ stories: filteredStories, isRefreshing: false })
    } catch (error) {
      console.error('Error refreshing stories:', error)
      set({ error: 'Failed to refresh stories', isRefreshing: false })
    }
  },

  getPostDetail: async (postId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getPostDetailApi(postId)
      console.log('Successful get post detail:', response)
      set({ currentPost: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching post detail:', error)
      set({ error: 'Failed to fetch post detail', isLoading: false })
    }
  },

  createPost: async (data: CreatePostRequest) => {
    try {
      const response = await createPostApi(data)
      console.log('Successful create post:', response)
      await addPostToStores(response.data)
      return response
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  updatePost: async (data: UpdatePostRequest) => {
    let snapshot
    try {
      const response = await updatePostApi(data)
      console.log('Successful update post:', response)
      const updatedPost = response.data
      snapshot = await updatePostWithSnapshot(updatedPost.id, updatedPost)

      return response
    } catch (error) {
      console.error('Error updating post:', error)
      if (snapshot) {
        await restorePostSnapshot(snapshot)
      }
      throw error
    }
  },

  deletePost: async (postId: string) => {
    let snapshot
    try {
      snapshot = await deletePostFromStores(postId)
      await deletePostApi(postId)
      console.log('Successful delete post')
    } catch (error) {
      console.error('Error deleting post:', error)
      if (snapshot) {
        await restorePostSnapshot(snapshot)
      }
      throw error
    }
  },

  likePost: async (postId: string, userId: string) => {
    let snapshot
    try {
      snapshot = await toggleLikeInStores(postId, userId)
      const response = await likePostApi({ postId, userId })
      console.log('Successful like post:', response)
    } catch (error) {
      console.error('Error liking post:', error)
      if (snapshot) {
        await restorePostSnapshot(snapshot)
      }
      throw error
    }
  },

  getUserLikes: async (postId: string) => {
    try {
      const response = await getUserLikesApi(postId)
      console.log('Successful get user likes:', response)
      return response.data
    } catch (error) {
      console.error('Error getting user likes:', error)
      throw error
    }
  },

  seenPost: (postId: string, userId: string) => {
    if (seenPostsCache.has(postId)) {
      return
    }

    seenPostsCache.add(postId)
    seenPendingBatch.set(postId, userId)
    addSeenToStores(postId, userId)

    if (batchTimer) {
      clearTimeout(batchTimer)
    }
    batchTimer = setTimeout(async () => {
      await get().flushSeenBatch()
    }, BATCH_FLUSH_DELAY)
  },

  flushSeenBatch: async () => {
    if (seenPendingBatch.size === 0) return

    const batch = new Map(seenPendingBatch)
    seenPendingBatch.clear()

    const userBatches = new Map<string, string[]>()
    batch.forEach((userId, postId) => {
      if (!userBatches.has(userId)) {
        userBatches.set(userId, [])
      }
      userBatches.get(userId)?.push(postId)
    })

    try {
      const promises = Array.from(userBatches.entries()).map(
        async ([userId, postIds]) => {
          try {
            const response = await seenPostApi({ postIds, viewerId: userId })
            console.log('Successful mark posts as seen:', response)
          } catch (error) {
            console.error(
              `Failed to mark posts as seen for user ${userId}:`,
              error
            )
            postIds.forEach(postId => {
              seenPendingBatch.set(postId, userId)
              seenPostsCache.delete(postId)
            })
          }
        }
      )

      await Promise.all(promises)
      console.log('Successfully flushed seen batch:', batch.size, 'posts')
    } catch (error) {
      console.error('Error flushing seen batch:', error)
    }
  },

  getUserSeen: async (postId: string) => {
    try {
      const response = await getUserSeenApi(postId)
      console.log('Successful get users seen:', response)
      return response.data
    } catch (error) {
      console.error('Error getting users seen:', error)
      throw error
    }
  },
}))
