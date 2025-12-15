export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type FriendStatus =
  | 'NONE'
  | 'SELF'
  | 'FRIEND'
  | 'INCOMING_PENDING'
  | 'OUTGOING_PENDING'

export interface User {
  id: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  gender: string | null
  dob: string | null
  bio: string | null
  postCount: number
  groupCount: number
  friendCount: number
  friendStatus: string | null
}
