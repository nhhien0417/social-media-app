import { create } from 'zustand'
import { Comment } from '@/types/Comment'
import {
  getCommentApi,
  createCommentApi,
  updateCommentApi,
  deleteCommentApi,
  likeCommentApi,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/api/api.post'

interface CommentState {
  comments: Comment[]
  isLoading: boolean
  error: string | null

  fetchComments: (postId: string) => Promise<void>
  addComment: (
    data: CreateCommentRequest,
    mediaFiles?: Array<{ uri: string; name: string; type: string }>
  ) => Promise<void>
  updateComment: (
    data: UpdateCommentRequest,
    mediaFiles?: Array<{ uri: string; name: string; type: string }>
  ) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  likeComment: (commentId: string, userId: string) => Promise<void>
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  fetchComments: async (postId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getCommentApi(postId)
      console.log('Successful fetch comments:', response)
      set({ comments: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching comments:', error)
      set({ error: 'Failed to fetch comments', isLoading: false })
    }
  },

  addComment: async (
    data: CreateCommentRequest,
    mediaFiles?: Array<{ uri: string; name: string; type: string }>
  ) => {
    try {
      const response = await createCommentApi(data, mediaFiles)
      console.log('Successful create comment:', response)
      set(state => ({ comments: [response.data, ...state.comments] }))
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  },

  updateComment: async (
    data: UpdateCommentRequest,
    mediaFiles?: Array<{ uri: string; name: string; type: string }>
  ) => {
    try {
      const response = await updateCommentApi(data, mediaFiles)
      console.log('Successful update comment:', response)
      set(state => ({
        comments: state.comments.map(c =>
          c.id === data.commentId ? response.data : c
        ),
      }))
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  },

  deleteComment: async (commentId: string) => {
    try {
      await deleteCommentApi(commentId)
      console.log('Successful delete comment:', commentId)
      set(state => ({
        comments: state.comments.filter(c => c.id !== commentId),
      }))
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },

  likeComment: async (commentId: string, userId: string) => {
    set(state => ({
      comments: state.comments.map(c => {
        if (c.id === commentId) {
          const isLiked = c.likes?.includes(userId)
          const newLikes = isLiked
            ? c.likes?.filter(id => id !== userId)
            : [...(c.likes || []), userId]
          return { ...c, likes: newLikes }
        }
        return c
      }),
    }))

    try {
      const response = await likeCommentApi({ commentId, userId })
      console.log('Successful like comment:', response)
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  },
}))
