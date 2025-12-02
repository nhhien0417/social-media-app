import { User } from './User'

export type PostType = 'POST' | 'STORY'
export type PostPrivacy = 'PUBLIC' | 'PRIVATE' | 'FRIENDS'

export interface Post {
  id: string
  groupId?: string
  content?: string
  media?: string[]
  createdAt: string
  updatedAt?: string
  type: PostType
  privacy: PostPrivacy
  likes: string[]
  seenBy: string[]
  commentsCount: number
  authorProfile: User
}
