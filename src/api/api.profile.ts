import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

export type ProfileData = {
  id: string
  email: string
  firstName: string
  lastName: string
  dob: string
}

export type AllProfileResponse = {
  statusCode: number
  error: null | string
  message: string
  data: ProfileData[]
}

export type UserProfileResponse = {
  statusCode: number
  error: null | string
  message: string
  data: ProfileData
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

export const getFriendApi = (userId: string) => {
  return ApiClient.get<AllProfileResponse>(ENDPOINTS.PROFILE.FRIENDS(userId))
}

export const getSentApi = (userId: string) => {
  return ApiClient.get<AllProfileResponse>(ENDPOINTS.PROFILE.SENT(userId))
}

export const getPendingApi = (userId: string) => {
  return ApiClient.get<AllProfileResponse>(ENDPOINTS.PROFILE.PENDING(userId))
}

export const addFriendApi = (data: FriendActionRequest) => {
  return ApiClient.post<FriendActionResponse>(ENDPOINTS.PROFILE.REQUEST, data)
}

export const acceptFriendApi = (data: FriendActionRequest) => {
  return ApiClient.post<FriendActionResponse>(ENDPOINTS.PROFILE.REQUEST, data)
}

export const rejectFriendAPi = (data: FriendActionRequest) => {
  return ApiClient.post<FriendActionResponse>(ENDPOINTS.PROFILE.REQUEST, data)
}
