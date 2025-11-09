export interface NotificationAction {
  label: string
  type: 'primary' | 'secondary'
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'message'
  | 'system'
  | 'other'
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPT'
  | 'FRIEND_REJECT'

export interface NotificationItem {
  id: number
  senderId: string
  section: string
  avatar?: string
  message: string
  time?: string
  unread?: boolean
  icon?: string
  actions?: NotificationAction[]
  type?: NotificationType
}
