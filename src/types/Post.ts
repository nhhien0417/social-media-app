import { User } from './User'

export type PostPrivacy = 'PUBLIC' | 'PRIVATE' | 'FRIENDS'

export interface Post {
  id: string
  author: User
  groupId?: string
  type?: string
  content?: string
  media?: string[]
  createdAt: string
  updatedAt?: string
  privacy: PostPrivacy
  likes: []
  commentsCount: number
}
