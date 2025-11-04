import { User } from './User'

export interface Story {
  id: string
  author: User
  thumbUrl: string
  hasNew: boolean
}
