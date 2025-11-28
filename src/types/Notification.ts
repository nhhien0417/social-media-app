export interface NotificationAction {
  label: string
  type: 'primary' | 'secondary'
}

export type NotificationType =
  | 'NEW_POST'
  | 'LIKE_POST'
  | 'SHARE_POST'
  | 'MENTION_POST'
  | 'COMMENT_ON_POST'
  | 'REPLY_COMMENT'
  | 'LIKE_COMMENT'
  | 'MENTION_COMMENT'
  | 'STORY_CREATE'
  | 'STORY_LIKE'
  | 'STORY_REPLY'
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'FRIEND_REQUEST_REMOVED'
  | 'GROUP_INVITE'
  | 'GROUP_JOIN_REQUEST'
  | 'GROUP_JOIN_ACCEPTED'
  | 'GROUP_ROLE_CHANGE'
  | 'GROUP_NEW_POST'

export interface NotificationItem {
  id: string
  read: boolean
  message: string
  createdAt: string
  senderId: string
  receiverId: string
  type: NotificationType
}
