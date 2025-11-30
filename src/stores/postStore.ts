import { create } from 'zustand'
import { Post } from '@/types/Post'
import { User } from '@/types/User'
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
  getUserLikesApi,
} from '@/api/api.post'
import { PostType } from '@/types/Post'
import {
  addPostToStores,
  updatePostWithSnapshot,
  deletePostFromStores,
  toggleLikeInStores,
  restorePostSnapshot,
} from '@/utils/SyncPosts'

interface PostState {
  // State
  posts: Post[]
  currentPost: Post | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Actions
  addPost: (post: Post) => void
  fetchFeed: (type: PostType) => Promise<void>
  refreshFeed: (type: PostType) => Promise<void>
  getPostDetail: (postId: string) => Promise<void>

  createPost: (data: CreatePostRequest) => Promise<CreatePostResponse>
  updatePost: (data: UpdatePostRequest) => Promise<UpdatePostResponse>
  deletePost: (postId: string) => Promise<void>
  likePost: (data: LikePostRequest) => Promise<LikePostResponse>
  getUserLikes: (postId: string) => Promise<User[]>
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

  fetchFeed: async (type: PostType) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getFeedApi(type)
      console.log('Successful fetch feed:', response)
      set({ posts: response.data.posts, isLoading: false })
    } catch (error) {
      console.error('Error fetching feed:', error)
      set({ error: 'Failed to fetch feed', isLoading: false })
    }
  },

  refreshFeed: async (type: PostType) => {
    set({ isRefreshing: true, error: null })
    try {
      const response = await getFeedApi(type)
      console.log('Successful refresh feed:', response)
      set({ posts: response.data.posts, isRefreshing: false })
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

  likePost: async (data: LikePostRequest) => {
    let snapshot
    try {
      snapshot = await toggleLikeInStores(data.postId, data.userId)
      const response = await likePostApi(data)
      console.log('Successful like post:', response)
      return response
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
}))
