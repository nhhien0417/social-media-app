import { NotificationItem } from '@/types/Notification'

export const getNotificationMessage = (
  notification: NotificationItem
): string => {
  const { type, extraData: data } = notification
  const senderName = data?.senderName || 'Someone'

  switch (type) {
    case 'NEW_POST':
      return `${senderName} posted a new photo`

    case 'LIKE_POST':
      return `${senderName} liked your post`

    case 'SHARE_POST':
      return `${senderName} shared your post`

    case 'MENTION_POST':
      return `${senderName} mentioned you in a post`

    case 'COMMENT_ON_POST':
      return `${senderName} commented on your post`

    case 'REPLY_COMMENT':
      return `${senderName} replied to your comment`

    case 'LIKE_COMMENT':
      return `${senderName} liked your comment`

    case 'MENTION_COMMENT':
      return `${senderName} mentioned you in a comment`

    case 'STORY_CREATE':
      return `${senderName} added to their story`

    case 'STORY_LIKE':
      return `${senderName} liked your story`

    case 'STORY_REPLY':
      return `${senderName} replied to your story`

    case 'FRIEND_REQUEST':
      return `${senderName} sent you a friend request`

    case 'FRIEND_REQUEST_ACCEPTED':
      return `${senderName} accepted your friend request`

    case 'FRIEND_REQUEST_REMOVED':
      return `${senderName} removed you from friends`

    case 'GROUP_INVITE':
      return `${senderName} invited you to a group`

    case 'GROUP_JOIN_REQUEST':
      return `${senderName} requested to join your group`

    case 'GROUP_JOIN_ACCEPTED':
      return `${senderName} accepted your group join request`

    case 'GROUP_ROLE_CHANGE':
      return `Your role in the group has changed`

    case 'GROUP_NEW_POST':
      return `${senderName} posted in the group`

    default:
      return notification.message || 'You have a new notification'
  }
}
