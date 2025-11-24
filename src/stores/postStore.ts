import { create } from 'zustand'
import { Post } from '@/types/Post'
import {
  getFeedApi,
  getPostDetailApi,
  createPostApi,
  updatePostApi,
  likePostApi,
  deletePostApi,
  CreatePostRequest,
  CreatePostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  LikePostRequest,
  LikePostResponse,
} from '@/api/api.post'

interface PostState {
  // State
  posts: Post[]
  currentPost: Post | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Actions
  addPost: (post: Post) => void
  fetchFeed: () => Promise<void>
  refreshFeed: () => Promise<void>
  getPostDetail: (postId: string) => Promise<void>

  createPost: (data: CreatePostRequest) => Promise<CreatePostResponse>
  updatePost: (data: UpdatePostRequest) => Promise<UpdatePostResponse>
  deletePost: (postId: string) => Promise<void>
  likePost: (data: LikePostRequest) => Promise<LikePostResponse>
}

export const usePostStore = create<PostState>((set, get) => ({
  // Initial State
  posts: [],
  currentPost: null,
  isLoading: false,
  isRefreshing: false,
  error: null,

  // Actions
  addPost: (post: Post) => {
    set(state => ({ posts: [post, ...state.posts] }))
  },

  fetchFeed: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getFeedApi()
      console.log('Successful fetch feed:', response)
      set({ posts: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching feed:', error)
      set({ error: 'Failed to fetch feed', isLoading: false })
    }
  },

  refreshFeed: async () => {
    set({ isRefreshing: true, error: null })
    try {
      const response = await getFeedApi()
      console.log('Successful refresh feed:', response)
      set({ posts: response.data, isRefreshing: false })
    } catch (error) {
      console.error('Error refreshing feed:', error)
      set({ error: 'Failed to refresh feed', isRefreshing: false })
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
      set(state => ({ posts: [response.data, ...state.posts] }))
      return response
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  updatePost: async (data: UpdatePostRequest) => {
    try {
      const response = await updatePostApi(data)
      console.log('Successful update post:', response)
      const updatedPost = response.data
      set(state => ({
        posts: state.posts.map(p =>
          p.id === updatedPost.id ? updatedPost : p
        ),
      }))
      return response
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  },

  deletePost: async (postId: string) => {
    const { posts } = get()
    const previousPosts = [...posts]

    set({ posts: posts.filter(p => p.id !== postId) })

    try {
      const response = await deletePostApi(postId)
      console.log('Successful delete post:', response)
    } catch (error) {
      console.error('Error deleting post:', error)
      set({ posts: previousPosts })
    }
  },

  likePost: async (data: LikePostRequest) => {
    const { posts } = get()
    const postIndex = posts.findIndex(p => p.id === data.postId)
    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    const post = posts[postIndex]
    const isLiked = post.likes.includes(data.userId)

    const updatedLikes = isLiked
      ? post.likes.filter(id => id !== data.userId)
      : [...post.likes, data.userId]

    const updatedPost = { ...post, likes: updatedLikes }
    const updatedPosts = [...posts]
    updatedPosts[postIndex] = updatedPost

    set({ posts: updatedPosts })

    try {
      const response = await likePostApi(data)
      console.log('Successful like post:', response)
      return response
    } catch (error) {
      console.error('Error liking post:', error)
      const revertedPosts = [...get().posts]
      revertedPosts[postIndex] = post
      set({ posts: revertedPosts })
      throw error
    }
  },
}))
