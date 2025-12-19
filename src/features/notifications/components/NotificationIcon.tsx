import {
  Share2,
  Heart,
  MessageCircle,
  UserPlus,
  Users,
  Image,
  Bell,
} from '@tamagui/lucide-icons'
import React from 'react'
import { NotificationType } from '@/types/Notification'

export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'NEW_POST':
      return <Image size={16} color="$blue10" />

    case 'NEW_STORY':
      return <Share2 size={16} color="$orange10" />

    case 'LIKE_POST':
    case 'LIKE_STORY':
    case 'LIKE_COMMENT':
      return <Heart size={16} color="$red10" />

    case 'COMMENT_ON_POST':
    case 'COMMENT_ON_STORY':
    case 'REPLY_COMMENT':
      return <MessageCircle size={16} color="$blue10" />

    case 'NEW_MESSAGE':
      return <MessageCircle size={16} color="$green10" />

    case 'FRIEND_REQUEST':
    case 'FRIEND_REQUEST_ACCEPTED':
      return <UserPlus size={16} color="$green10" />

    case 'GROUP_JOIN_REQUEST':
    case 'GROUP_JOIN_ACCEPTED':
    case 'GROUP_ROLE_CHANGE':
    case 'GROUP_NEW_POST':
      return <Users size={16} color="$purple10" />

    default:
      return <Bell size={16} color="#888" />
  }
}
