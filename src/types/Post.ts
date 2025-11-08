import { Media } from './Media'
import { User } from './User'

export interface Post {
  id: string
  author: User
  media: Media[]
  caption?: string
  likeCount: number
  commentCount: number
  createdAt: string
  liked?: boolean
  saved?: boolean
}

