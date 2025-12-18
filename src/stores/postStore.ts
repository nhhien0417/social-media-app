import { create } from 'zustand'
import { Post } from '@/types/Post'
import { User } from '@/types/User'
import { useProfileStore } from './profileStore'
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
  userStories: Record<string, Post[]>
  currentPost: Post | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Pagination State
  feedPagination: { page: number; hasNext: boolean }
  groupPostsPagination: Record<string, { page: number; hasNext: boolean }>

  // Actions
  fetchPosts: (refresh?: boolean) => Promise<void>
  fetchStories: () => Promise<void>
  fetchGroupPosts: (groupId: string, refresh?: boolean) => Promise<void>
  fetchUserPosts: (userId: string) => Promise<void>
  fetchUserStories: (userId: string) => Promise<void>
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
  userStories: {},
  currentPost: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  feedPagination: { page: 0, hasNext: true },
  groupPostsPagination: {},

  // Actions
  fetchPosts: async (refresh = false) => {
    const { feedPagination, isLoading, isRefreshing } = get()

    if (isLoading || isRefreshing) {
      return
    }

    const page = refresh ? 0 : feedPagination.page

    if (!refresh && !feedPagination.hasNext) {
      return
    }

    if (refresh) {
      set({ isRefreshing: true, error: null })
    } else {
      set({ isLoading: true, error: null })
    }

    try {
      const response = await getFeedApi('POST', page)
      console.log('Successful fetch posts:', response)

      const currentUserId = await getUserId()
      const filteredPosts = feedFilter(
        response.data.posts,
        'POST',
        currentUserId || undefined
      )

      set(state => ({
        posts: refresh ? filteredPosts : [...state.posts, ...filteredPosts],
        feedPagination: {
          page: page + 1,
          hasNext: response.data.hasNext,
        },
        isLoading: false,
        isRefreshing: false,
      }))
    } catch (error) {
      console.error('Error fetching posts:', error)
      set({
        error: 'Failed to fetch posts',
        isLoading: false,
        isRefreshing: false,
      })
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

  fetchGroupPosts: async (groupId: string, refresh = false) => {
    const { groupPostsPagination, isLoading, isRefreshing } = get()

    if (isLoading || isRefreshing) {
      return
    }

    const currentPagination = groupPostsPagination[groupId] || {
      page: 0,
      hasNext: true,
    }
    const page = refresh ? 0 : currentPagination.page

    if (!refresh && !currentPagination.hasNext) {
      return
    }

    set({ isLoading: true, error: null })
    try {
      const response = await getGroupPostsApi(groupId, page)
      console.log('Successful fetch group posts:', response)

      set(state => {
        const currentPosts = state.groupPosts[groupId] || []
        return {
          groupPosts: {
            ...state.groupPosts,
            [groupId]: refresh
              ? response.data.posts
              : [...currentPosts, ...response.data.posts],
          },
          groupPostsPagination: {
            ...state.groupPostsPagination,
            [groupId]: {
              page: page + 1,
              hasNext: response.data.hasNext,
            },
          },
          isLoading: false,
        }
      })
    } catch (error) {
      console.error('Error fetching group posts:', error)
      set({ error: 'Failed to fetch group posts', isLoading: false })
    }
  },

  fetchUserPosts: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getUserPostsApi(userId, 'POST')
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

  fetchUserStories: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getUserPostsApi(userId, 'STORY')
      console.log('Successful fetch user stories:', response)

      set(state => ({
        userStories: {
          ...state.userStories,
          [userId]: response.data.posts,
        },
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error fetching user stories:', error)
      set({ error: 'Failed to fetch user stories', isLoading: false })
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
      let newPost = response.data

      if (!newPost.likes) {
        newPost = { ...newPost, likes: [] }
      }

      if (!newPost.authorProfile) {
        const currentUser = useProfileStore.getState().currentUser
        if (currentUser && currentUser.id === data.userId) {
          newPost = { ...newPost, authorProfile: currentUser }
        } else {
          newPost = {
            ...newPost,
            authorProfile: {
              id: data.userId,
            } as User,
          }
        }
      }

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
      let updatedPost = response.data

      if (!updatedPost.authorProfile) {
        const originalPost =
          oldState.posts.find(p => p.id === data.postId) ||
          oldState.stories.find(p => p.id === data.postId) ||
          (oldState.currentPost?.id === data.postId
            ? oldState.currentPost
            : undefined) ||
          Object.values(oldState.groupPosts)
            .flat()
            .find(p => p.id === data.postId) ||
          Object.values(oldState.userPosts)
            .flat()
            .find(p => p.id === data.postId) ||
          Object.values(oldState.userStories)
            .flat()
            .find(p => p.id === data.postId)

        if (originalPost?.authorProfile) {
          updatedPost = {
            ...updatedPost,
            authorProfile: originalPost.authorProfile,
          }
        } else {
          const currentUser = useProfileStore.getState().currentUser
          if (currentUser) {
            updatedPost = { ...updatedPost, authorProfile: currentUser }
          }
        }
      }

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
        userStories: Object.keys(state.userStories).reduce(
          (acc, userId) => {
            acc[userId] = state.userStories[userId].map(p =>
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
        userStories: oldState.userStories,
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
      userStories: Object.keys(state.userStories).reduce(
        (acc, userId) => {
          acc[userId] = state.userStories[userId].filter(p => p.id !== postId)
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
        userStories: oldState.userStories,
        currentPost: oldState.currentPost,
      })
      throw error
    }
  },

  likePost: async (postId: string, userId: string) => {
    const toggleLike = (post: Post) => {
      if (post.id !== postId) return post

      const currentLikes = post.likes || []
      const likes = currentLikes.includes(userId)
        ? currentLikes.filter(id => id !== userId)
        : [...currentLikes, userId]
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
      userStories: Object.keys(state.userStories).reduce(
        (acc, uid) => {
          acc[uid] = state.userStories[uid].map(toggleLike)
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
        userStories: oldState.userStories,
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
