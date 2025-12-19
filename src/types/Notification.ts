export type NotificationType =
  | 'NEW_POST'
  | 'LIKE_POST'
  | 'COMMENT_ON_POST'
  | 'LIKE_COMMENT'
  | 'REPLY_COMMENT'
  | 'NEW_MESSAGE'
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'GROUP_NEW_POST'
  | 'GROUP_ROLE_CHANGE'
  | 'GROUP_JOIN_REQUEST'
  | 'GROUP_JOIN_ACCEPTED'

export interface Notification {
  id: string
  read: boolean
  message: string
  createdAt: string
  senderId: string
  receiverId: string
  type: NotificationType
  extraData?: {
    postId?: string
    commentId?: string
    groupId?: string
    storyId?: string
    [key: string]: any
  }
}
