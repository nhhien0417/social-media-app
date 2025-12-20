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
  senderId: string
  receiverId: string
  type: NotificationType
  read: boolean
  createdAt: string
  extraData?: {
    postId?: string
    storyId?: string
    commentId?: string
    groupId?: string
    chatId?: string
    messageId?: string
    [key: string]: any
  }
}
