import { User } from '@/types/User'
import { ApiClient, ApiClientForm } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { dataURItoBlob } from '@/utils/MediaUtils'
import { Platform } from 'react-native'

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

// --- API Functions ---

export const getAllProfilesApi = () => {
  return ApiClient.get<AllProfileResponse>(ENDPOINTS.PROFILE.ALL)
}

export const getUserApi = (userId: string) => {
  return ApiClient.get<UserProfileResponse>(ENDPOINTS.PROFILE.DETAIL(userId))
}

export const updateProfileApi = async (
  data: UpdateProfileRequest,
  avatar?: { uri: string; name: string; type: string }
): Promise<UserProfileResponse> => {
  const formData = new FormData()
  formData.append('profile', JSON.stringify(data))

  if (avatar) {
    if (avatar.uri.startsWith('data:')) {
      const blob = dataURItoBlob(avatar.uri)
      formData.append('media', blob, avatar.name)
    } else if (Platform.OS === 'web') {
      const response = await fetch(avatar.uri)
      const blob = await response.blob()
      formData.append('media', blob, avatar.name)
    } else {
      formData.append('media', {
        uri: avatar.uri,
        name: avatar.name,
        type: avatar.type,
      } as any)
    }
  }

  return ApiClientForm.upload<UserProfileResponse>(
    'PUT',
    `/${ENDPOINTS.PROFILE.UPDATE}`,
    formData
  )
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
