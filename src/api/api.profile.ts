import ApiClient from './apiClient'

export type ProfileData = {
  id: string
  email: string
  firstName: string
  lastName: string
  dob: string
}

export type AllProfileResponse = {
  data: ProfileData[]
}

export type AddFriendRequest = {
  userId: string
  friendUserId: string
}

export type AddFriendResponse = {
  data: string
}

export const getAllProfilesApi = () => {
  return ApiClient.get<AllProfileResponse>('profile/users')
}

export const addFriend = (data: AddFriendRequest) => {
  return ApiClient.post<AddFriendResponse>('profile/friendships/request', data)
}
