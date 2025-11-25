import { User } from './User'

export interface Comment {
  id: string
  postId: string
  author: User
  content?: string
  media?: string[]
  createdAt: string
  updatedAt?: string
  parentCommentId?: string
  likes?: string[]
}
