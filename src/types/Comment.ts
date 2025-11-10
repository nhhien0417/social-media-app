import { User } from './User'

export interface Comment {
  id: string
  postId: string
  author: User
  content: string
  likeCount: number
  replyCount: number
  createdAt: string
  liked?: boolean
  parentId?: string
}
