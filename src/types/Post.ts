import { Media } from './Media'
import { User } from './User'

export type PostPrivacy = 'PUBLIC' | 'PRIVATE' | 'FRIENDS'

export interface Post {
  id: string
  userId: string
  author: User
  content: string
  media?: Media[]
  groupId?: string
  privacy: PostPrivacy
  likeCount: number
  commentCount: number
  shareCount: number
  createdAt: string
  updatedAt?: string
  liked?: boolean
  saved?: boolean
}
