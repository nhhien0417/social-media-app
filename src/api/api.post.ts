import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Post } from '@/types/Post'

export type CreatePostRequest = {
  userId: string
  content?: string
  groupId?: string
  privacy: 'PUBLIC' | 'PRIVATE' | 'FRIEND'
  media?: string[]
}

export type LikePostRequest = {
  postId: string
  userId: string
}

export type CreatePostResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post
}

export type LikePostResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post
}

export type GetPostsResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post[]
}

export type GetPostDetailResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post
}

export const createPostApi = (data: CreatePostRequest) => {
  const formData = new FormData()

  formData.append('userId', data.userId)

  if (data.content) {
    formData.append('content', data.content)
  }

  formData.append('privacy', data.privacy)

  if (data.groupId) {
    formData.append('groupId', data.groupId)
  }

  if (data.media && data.media.length > 0) {
    data.media.forEach(file => {
      formData.append('media', file)
    })
  }

  return ApiClient.post<CreatePostResponse>(ENDPOINTS.POSTS.CREATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const likePostApi = (data: LikePostRequest) => {
  return ApiClient.post<LikePostResponse>(ENDPOINTS.POSTS.LIKE, data)
}

export const getPostsApi = () => {
  return ApiClient.get<GetPostsResponse>(ENDPOINTS.POSTS.ALL)
}

export const getPostDetailApi = (postId: string) => {
  return ApiClient.get<GetPostDetailResponse>(ENDPOINTS.POSTS.DETAIL(postId))
}
