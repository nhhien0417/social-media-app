import { User } from './User'

export interface StoryMedia {
  id: string
  mediaUrl: string
  type: 'image' | 'video'
  duration?: number
}

export interface Story {
  id: string
  author: User
  thumbUrl: string
  hasNew: boolean
  stories: StoryMedia[]
}
