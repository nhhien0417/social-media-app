import { create } from 'zustand'
import { Post } from '@/types/Post'
import { User } from '@/types/User'
import {
  getFeedApi,
  getGroupPostsApi,
  getUserPostsApi,
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
  groupPosts: Record<string, Post[]>
  userPosts: Record<string, Post[]>
  currentPost: Post | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Actions
  fetchPosts: () => Promise<void>
  refreshPosts: () => Promise<void>
  fetchStories: () => Promise<void>
  refreshStories: () => Promise<void>
  fetchGroupPosts: (groupId: string, page?: number) => Promise<void>
  fetchUserPosts: (userId: string, page?: number) => Promise<void>
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
  groupPosts: {},
  userPosts: {},
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

  fetchGroupPosts: async (groupId: string, page = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getGroupPostsApi(groupId, page)
      console.log('Successful fetch group posts:', response)

      set(state => ({
        groupPosts: {
          ...state.groupPosts,
          [groupId]: response.data.posts,
        },
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error fetching group posts:', error)
      set({ error: 'Failed to fetch group posts', isLoading: false })
    }
  },

  fetchUserPosts: async (userId: string, page = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getUserPostsApi(userId, page)
      console.log('Successful fetch user posts:', response)

      set(state => ({
        userPosts: {
          ...state.userPosts,
          [userId]: response.data.posts,
        },
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error fetching user posts:', error)
      set({ error: 'Failed to fetch user posts', isLoading: false })
    }
  },

  getPostDetail: async (postId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getPostDetailApi(postId)
      console.log('Successful get post detail:', response)
      const post = response.data

      set(state => ({
        posts: state.posts.some(p => p.id === postId)
          ? state.posts
          : [post, ...state.posts],
        currentPost: post,
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error fetching post detail:', error)
      set({ error: 'Failed to fetch post detail', isLoading: false })
    }
  },

  createPost: async (data: CreatePostRequest) => {
    try {
      const response = await createPostApi(data)
      console.log('Successful create post:', response)
      const newPost = response.data

      if (data.groupId) {
        set(state => ({
          groupPosts: {
            ...state.groupPosts,
            [data.groupId!]: [
              newPost,
              ...(state.groupPosts[data.groupId!] || []),
            ],
          },
        }))
      } else if (data.type === 'STORY') {
        set(state => ({ stories: [newPost, ...state.stories] }))
      } else {
        set(state => ({ posts: [newPost, ...state.posts] }))
      }

      return response
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  updatePost: async (data: UpdatePostRequest) => {
    const oldState = get()

    try {
      const response = await updatePostApi(data)
      console.log('Successful update post:', response)
      const updatedPost = response.data

      set(state => ({
        posts: state.posts.map(p =>
          p.id === updatedPost.id ? updatedPost : p
        ),
        stories: state.stories.map(p =>
          p.id === updatedPost.id ? updatedPost : p
        ),
        groupPosts: Object.keys(state.groupPosts).reduce(
          (acc, groupId) => {
            acc[groupId] = state.groupPosts[groupId].map(p =>
              p.id === updatedPost.id ? updatedPost : p
            )
            return acc
          },
          {} as Record<string, Post[]>
        ),
        userPosts: Object.keys(state.userPosts).reduce(
          (acc, userId) => {
            acc[userId] = state.userPosts[userId].map(p =>
              p.id === updatedPost.id ? updatedPost : p
            )
            return acc
          },
          {} as Record<string, Post[]>
        ),
        currentPost:
          state.currentPost?.id === updatedPost.id
            ? updatedPost
            : state.currentPost,
      }))

      return response
    } catch (error) {
      console.error('Error updating post:', error)
      set({
        posts: oldState.posts,
        stories: oldState.stories,
        groupPosts: oldState.groupPosts,
        userPosts: oldState.userPosts,
        currentPost: oldState.currentPost,
      })
      throw error
    }
  },

  deletePost: async (postId: string) => {
    const oldState = get()

    set(state => ({
      posts: state.posts.filter(p => p.id !== postId),
      stories: state.stories.filter(p => p.id !== postId),
      groupPosts: Object.keys(state.groupPosts).reduce(
        (acc, groupId) => {
          acc[groupId] = state.groupPosts[groupId].filter(p => p.id !== postId)
          return acc
        },
        {} as Record<string, Post[]>
      ),
      userPosts: Object.keys(state.userPosts).reduce(
        (acc, userId) => {
          acc[userId] = state.userPosts[userId].filter(p => p.id !== postId)
          return acc
        },
        {} as Record<string, Post[]>
      ),
      currentPost: state.currentPost?.id === postId ? null : state.currentPost,
    }))

    try {
      await deletePostApi(postId)
      console.log('Successful delete post')
    } catch (error) {
      console.error('Error deleting post:', error)
      set({
        posts: oldState.posts,
        stories: oldState.stories,
        groupPosts: oldState.groupPosts,
        userPosts: oldState.userPosts,
        currentPost: oldState.currentPost,
      })
      throw error
    }
  },

  likePost: async (postId: string, userId: string) => {
    const toggleLike = (post: Post) => {
      if (post.id !== postId) return post
      const likes = post.likes.includes(userId)
        ? post.likes.filter(id => id !== userId)
        : [...post.likes, userId]
      return { ...post, likes }
    }

    const oldState = get()
    set(state => ({
      posts: state.posts.map(toggleLike),
      stories: state.stories.map(toggleLike),
      groupPosts: Object.keys(state.groupPosts).reduce(
        (acc, groupId) => {
          acc[groupId] = state.groupPosts[groupId].map(toggleLike)
          return acc
        },
        {} as Record<string, Post[]>
      ),
      userPosts: Object.keys(state.userPosts).reduce(
        (acc, uid) => {
          acc[uid] = state.userPosts[uid].map(toggleLike)
          return acc
        },
        {} as Record<string, Post[]>
      ),
      currentPost: state.currentPost ? toggleLike(state.currentPost) : null,
    }))

    try {
      const response = await likePostApi({ postId, userId })
      console.log('Successful like post:', response)
    } catch (error) {
      console.error('Error liking post:', error)
      set({
        posts: oldState.posts,
        stories: oldState.stories,
        groupPosts: oldState.groupPosts,
        userPosts: oldState.userPosts,
        currentPost: oldState.currentPost,
      })
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
