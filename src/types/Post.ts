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

export interface Media {
  id: string
  type: 'image' | 'video'
  url: string
  ratio: number
  thumbUrl?: string
}
