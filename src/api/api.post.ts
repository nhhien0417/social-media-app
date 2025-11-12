import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Post } from '@/types/Post'
import { getAccessToken } from '@/utils/SecureStore'
import { API_BASE_URL } from './axios.config'

export type CreatePostRequest = {
  userId: string
  content?: string
  groupId?: string
  privacy: 'PUBLIC' | 'PRIVATE' | 'FRIEND'
  media?: Array<{
    uri: string
    name: string
    type: string
  }>
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

      xhr.open('POST', `${API_BASE_URL}/${ENDPOINTS.POSTS.CREATE}`)

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    } catch (error) {
      reject(error)
    }
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
