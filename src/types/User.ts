import { Post } from './Post'

export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  gender?: string
  bio?: string
  dob?: string
  post?: Post[]
  friendships?: User[]
}
