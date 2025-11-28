import { User } from '@/types/User'
import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import { getAccessToken } from '@/utils/SecureStore'
import { API_BASE_URL } from './axios.config'
import { dataURItoBlob } from '@/utils/ConvertData'

export type AllProfileResponse = {
  statusCode: number
  error: null | string
  message: string
  data: User[]
}

export type UserProfileResponse = {
  statusCode: number
  error: null | string
  message: string
  data: User
}

export type UpdateProfileRequest = {
  userId: string
  username?: string
  firstName?: string
  lastName?: string
  bio?: string
  dob?: string
  gender?: string
}

export type FriendActionRequest = {
  userId: string
  friendUserId: string
}

export type FriendActionResponse = {
  statusCode: number
  error: null | string
  message: string
  data: string
}

export const getAllProfilesApi = () => {
  return ApiClient.get<AllProfileResponse>(ENDPOINTS.PROFILE.ALL)
}

export const getUserApi = (userId: string) => {
  return ApiClient.get<UserProfileResponse>(ENDPOINTS.PROFILE.DETAIL(userId))
}

export const updateProfileApi = (
  data: UpdateProfileRequest,
  avatar?: { uri: string; name: string; type: string }
): Promise<UserProfileResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData()
      formData.append('profile', JSON.stringify(data))

      if (avatar) {
        if (avatar.uri.startsWith('data:')) {
          const blob = dataURItoBlob(avatar.uri)
          formData.append('media', blob, avatar.name)
        } else {
          formData.append('media', {
            uri: avatar.uri,
            name: avatar.name,
            type: avatar.type,
          } as any)
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

      xhr.open('PUT', `${API_BASE_URL}/${ENDPOINTS.PROFILE.UPDATE}`)

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    } catch (error) {
      reject(error)
    }
  })
}

export const getFriendApi = (
  userId: string,
  page: number = 0,
  size: number = 100
) => {
  return ApiClient.get<AllProfileResponse>(
    `${ENDPOINTS.PROFILE.FRIENDS(userId)}?page=${page}&size=${size}`
  )
}

export const getSentApi = (
  userId: string,
  page: number = 0,
  size: number = 100
) => {
  return ApiClient.get<AllProfileResponse>(
    `${ENDPOINTS.PROFILE.SENT(userId)}?page=${page}&size=${size}`
  )
}

export const getPendingApi = (
  userId: string,
  page: number = 0,
  size: number = 100
) => {
  return ApiClient.get<AllProfileResponse>(
    `${ENDPOINTS.PROFILE.PENDING(userId)}?page=${page}&size=${size}`
  )
}

export const addFriendApi = (data: FriendActionRequest) => {
  return ApiClient.post<FriendActionResponse>(ENDPOINTS.PROFILE.REQUEST, data)
}

export const acceptFriendApi = (data: FriendActionRequest) => {
  return ApiClient.post<FriendActionResponse>(ENDPOINTS.PROFILE.ACCEPT, data)
}

export const rejectFriendAPi = (data: FriendActionRequest) => {
  return ApiClient.post<FriendActionResponse>(ENDPOINTS.PROFILE.REJECT, data)
}
