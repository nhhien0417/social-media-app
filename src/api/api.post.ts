import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Post, PostPrivacy } from '@/types/Post'
import { getAccessToken } from '@/utils/SecureStore'
import { API_BASE_URL } from './axios.config'
import { Comment } from '@/types/Comment'
import { User } from '@/types/User'
import { dataURItoBlob } from '@/utils/MediaUtils'
import { Platform } from 'react-native'

export type GetFeedResponse = {
  statusCode: number
  error: null | string
  message: string
  data: {
    posts: Post[]
  }
}

export type GetPostDetailResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post
}

export type CreatePostRequest = {
  userId: string
  content?: string
  groupId?: string
  privacy: PostPrivacy
  media?: Array<{
    uri: string
    name: string
    type: string
  }>
}

export type CreatePostResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post
}

export type UpdatePostRequest = {
  postId: string
  content?: string
  privacy: PostPrivacy
  media?: Array<{
    uri: string
    name: string
    type: string
  }>
}

export type UpdatePostResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post
}

export type LikePostRequest = {
  postId: string
  userId: string
}

export type LikePostResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Post
}

export type GetUserLikesResponse = {
  statusCode: number
  error: null | string
  message: string
  data: User[]
}

export type GetCommentResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Comment[]
}

export type CreateCommentRequest = {
  postId: string
  authorId: string
  parentCommentId?: string
  content?: string
}

export type CreateCommnetResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Comment
}

export type UpdateCommentRequest = {
  commentId: string
  content?: string
}

export type UpdateCommentResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Comment
}

export type LikeCommentRequest = {
  commentId: string
  userId: string
}

export type LikeCommentResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Comment
}

export const getFeedApi = () => {
  return ApiClient.get<GetFeedResponse>(ENDPOINTS.POSTS.POST_FEED)
}

export const getPostDetailApi = (postId: string) => {
  return ApiClient.get<GetPostDetailResponse>(
    ENDPOINTS.POSTS.POST_DETAIL(postId)
  )
}

export const createPostApi = (
  data: CreatePostRequest
): Promise<CreatePostResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData()

      formData.append('userId', data.userId)
      formData.append('privacy', data.privacy)

      if (data.content) {
        formData.append('content', data.content)
      }

      if (data.groupId) {
        formData.append('groupId', data.groupId)
      }

      if (data.media && data.media.length > 0) {
        for (const file of data.media) {
          if (file.uri.startsWith('data:')) {
            const blob = dataURItoBlob(file.uri)
            formData.append('media', blob, file.name)
          } else if (Platform.OS === 'web') {
            const response = await fetch(file.uri)
            const blob = await response.blob()
            formData.append('media', blob, file.name)
          } else {
            formData.append('media', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any)
          }
        }
      }

      const token = await getAccessToken()
      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error'))
      }

      xhr.open('POST', `${API_BASE_URL}/${ENDPOINTS.POSTS.POST_CREATE}`)

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    } catch (error) {
      reject(error)
    }
  })
}

export const updatePostApi = (
  data: UpdatePostRequest
): Promise<UpdatePostResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData()

      formData.append('postId', data.postId)
      formData.append('privacy', data.privacy)

      if (data.content) {
        formData.append('content', data.content)
      }

      if (data.media && data.media.length > 0) {
        for (const file of data.media) {
          if (file.uri.startsWith('data:')) {
            const blob = dataURItoBlob(file.uri)
            formData.append('media', blob, file.name)
          } else if (Platform.OS === 'web') {
            const response = await fetch(file.uri)
            const blob = await response.blob()
            formData.append('media', blob, file.name)
          } else {
            formData.append('media', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any)
          }
        }
      }

      const token = await getAccessToken()
      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error'))
      }

      xhr.open('POST', `${API_BASE_URL}/${ENDPOINTS.POSTS.POST_UPDATE}`)

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    } catch (error) {
      reject(error)
    }
  })
}

export const deletePostApi = (postId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.POSTS.POST_DELETE(postId))
}

export const likePostApi = (data: LikePostRequest) => {
  return ApiClient.post<LikePostResponse>(ENDPOINTS.POSTS.POST_LIKE, data)
}

export const getUserLikesApi = (postId: string) => {
  return ApiClient.get<GetUserLikesResponse>(
    ENDPOINTS.POSTS.POST_USERLIKES(postId)
  )
}

export const getCommentApi = (postId: string) => {
  return ApiClient.get<GetCommentResponse>(ENDPOINTS.POSTS.COMMENT_GET(postId))
}

export const createCommentApi = (
  data: CreateCommentRequest,
  mediaFiles?: Array<{ uri: string; name: string; type: string }>
): Promise<CreateCommnetResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData()
      formData.append('comment', JSON.stringify(data))

      if (mediaFiles && mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          if (file.uri.startsWith('data:')) {
            const blob = dataURItoBlob(file.uri)
            formData.append('media', blob, file.name)
          } else if (Platform.OS === 'web') {
            const response = await fetch(file.uri)
            const blob = await response.blob()
            formData.append('media', blob, file.name)
          } else {
            formData.append('media', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any)
          }
        }
      }

      const token = await getAccessToken()
      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error'))
      }

      xhr.open('POST', `${API_BASE_URL}/${ENDPOINTS.POSTS.COMMENT_CREATE}`)

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    } catch (error) {
      reject(error)
    }
  })
}

export const updateCommentApi = (
  data: UpdateCommentRequest,
  mediaFiles?: Array<{ uri: string; name: string; type: string }>
): Promise<UpdateCommentResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData()
      formData.append('comment', JSON.stringify(data))

      if (mediaFiles && mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          if (file.uri.startsWith('data:')) {
            const blob = dataURItoBlob(file.uri)
            formData.append('media', blob, file.name)
          } else if (Platform.OS === 'web') {
            const response = await fetch(file.uri)
            const blob = await response.blob()
            formData.append('media', blob, file.name)
          } else {
            formData.append('media', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any)
          }
        }
      }

      const token = await getAccessToken()
      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error'))
      }

      xhr.open('PUT', `${API_BASE_URL}/${ENDPOINTS.POSTS.COMMENT_UPDATE}`)

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    } catch (error) {
      reject(error)
    }
  })
}

export const deleteCommentApi = (commentId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.POSTS.COMMENT_DELETE(commentId))
}

export const likeCommentApi = (data: LikeCommentRequest) => {
  return ApiClient.post<LikeCommentResponse>(ENDPOINTS.POSTS.COMMENT_LIKE, data)
}
