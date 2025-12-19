import { Notification } from '@/types/Notification'

export const getNotificationMessage = (
  type: Notification['type'],
  senderUsername?: string
): string => {
  const senderName = senderUsername || 'Someone'

  switch (type) {
    case 'NEW_POST':
      return `${senderName} posted a new photo`

    case 'LIKE_POST':
      return `${senderName} liked your post`

    case 'NEW_STORY':
      return `${senderName} posted a new story`

    case 'LIKE_STORY':
      return `${senderName} liked your story`

    case 'COMMENT_ON_POST':
      return `${senderName} commented on your post`

    case 'COMMENT_ON_STORY':
      return `${senderName} replied to your story`

    case 'REPLY_COMMENT':
      return `${senderName} replied to your comment`

    case 'LIKE_COMMENT':
      return `${senderName} liked your comment`

    case 'NEW_MESSAGE':
      return `${senderName} sent you a message`

    case 'FRIEND_REQUEST':
      return `${senderName} sent you a friend request`

    case 'FRIEND_REQUEST_ACCEPTED':
      return `${senderName} accepted your friend request`

    case 'GROUP_JOIN_REQUEST':
      return `${senderName} requested to join your group`

    case 'GROUP_JOIN_ACCEPTED':
      return `${senderName} accepted your group join request`

    case 'GROUP_ROLE_CHANGE':
      return `Your role in the group has changed`

    case 'GROUP_NEW_POST':
      return `${senderName} posted in the group`

    default:
      return 'You have a new notification'
  }
}
