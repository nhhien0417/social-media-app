import { Post } from './Post'

export interface User {
  id: string
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  gender: string | null
  bio: string | null
  dob: string | null
  posts: Post[] | null
  friendships: User[] | null
}
