import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Post, PostPrivacy } from '@/types/Post'
import { getAccessToken } from '@/utils/SecureStore'
import { API_BASE_URL } from './axios.config'
import { Comment } from '@/types/Comment'

export type GetFeedResponse = {
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

export type GetCommentResponse = {
  statusCode: number
  error: null | string
  message: string
  data: Comment[]
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

const dataURItoBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
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
        data.media.forEach(file => {
          if (file.uri.startsWith('data:')) {
            const blob = dataURItoBlob(file.uri)
            formData.append('media', blob, file.name)
          } else {
            formData.append('media', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any)
          }
        })
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
        data.media.forEach(file => {
          if (file.uri.startsWith('data:')) {
            const blob = dataURItoBlob(file.uri)
            formData.append('media', blob, file.name)
          } else {
            formData.append('media', {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as any)
          }
        })
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

export const getCommentApi = (postId: string) => {
  return ApiClient.get<GetCommentResponse>(ENDPOINTS.POSTS.COMMENT_GET(postId))
}


export const deleteCommentApi = (commentId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.POSTS.COMMENT_DELETE(commentId))
}

export const likeCommentApi = (data: LikeCommentRequest) => {
  return ApiClient.post<LikeCommentResponse>(ENDPOINTS.POSTS.COMMENT_LIKE, data)
}
