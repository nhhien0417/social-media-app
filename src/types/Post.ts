import { User } from './User'

export type PostPrivacy = 'PUBLIC' | 'PRIVATE' | 'FRIENDS'

export interface Post {
  id: string
  groupId?: string
  content?: string
  media?: string[]
  createdAt: string
  updatedAt?: string
  privacy: PostPrivacy
  likes: string[]
  commentsCount: number
  authorProfile: User
}
