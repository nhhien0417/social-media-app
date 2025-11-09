import ApiClient from './apiClient'

export type UserProfileResponse = {
  data: User[]
}

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  dob: string
}

export type AddFriendRequest = {
  userId: string
  friendUserId: string
}

export type AddFriendResponse = {
  data: string
}

export const getAllProfilesApi = () => {
  return ApiClient.get<UserProfileResponse[]>('profile/users')
}

export const addFriend = (data: AddFriendRequest) => {
  return ApiClient.post<AddFriendResponse>('profile/friendships/request', data)
}
