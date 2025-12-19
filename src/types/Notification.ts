export type NotificationType =
  | 'NEW_POST'
  | 'LIKE_POST'
  | 'NEW_STORY'
  | 'LIKE_STORY'
  | 'COMMENT_ON_POST'
  | 'COMMENT_ON_STORY'
  | 'REPLY_COMMENT'
  | 'LIKE_COMMENT'
  | 'NEW_MESSAGE'
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'GROUP_JOIN_REQUEST'
  | 'GROUP_JOIN_ACCEPTED'
  | 'GROUP_ROLE_CHANGE'
  | 'GROUP_NEW_POST'

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
    storyId?: string
    commentId?: string
    chatId?: string
    groupId?: string
    [key: string]: any
  }
}
