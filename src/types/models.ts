// src/types/models.ts

/** USER PROFILE */
export interface User {
  id: string
  username: string
  name?: string
  avatarUrl?: string
  isPrivate?: boolean
  followed?: boolean
}

/** MEDIA (ảnh hoặc video trong post) */
export interface Media {
  id: string
  type: 'image' | 'video'
  url: string
  ratio: number
  thumbUrl?: string
}

/** POST (bài đăng trên feed) */
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

/** STORY (hiển thị trong thanh storybar) */
export interface Story {
  id: string
  author: User
  thumbUrl: string
  hasNew: boolean
}

/** NOTIFICATION */
export interface NotificationAction {
  label: string
  type: 'primary' | 'secondary'
}

export interface NotificationItem {
  id: number
  section: string
  avatar: string
  message: string
  time: string
  unread?: boolean
  icon?: string
  actions?: NotificationAction[]
}
