import {
  Share2,
  Heart,
  MessageCircle,
  UserPlus,
  UserMinus,
  Users,
  Image,
  Bell,
} from '@tamagui/lucide-icons'
import React from 'react'

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'NEW_POST':
      return <Image size={16} color="$blue10" />

    case 'SHARE_POST':
      return <Share2 size={16} color="$orange10" />

    case 'LIKE_POST':
    case 'LIKE_COMMENT':
      return <Heart size={16} color="$red10" />

    case 'COMMENT_ON_POST':
    case 'MENTION_POST':
    case 'REPLY_COMMENT':
    case 'MENTION_COMMENT':
      return <MessageCircle size={16} color="$blue10" />

    case 'FRIEND_REQUEST':
    case 'FRIEND_REQUEST_ACCEPTED':
      return <UserPlus size={16} color="$green10" />

    case 'GROUP_INVITE':
    case 'GROUP_NEW_POST':
    case 'GROUP_ROLE_CHANGE':
    case 'GROUP_JOIN_REQUEST':
    case 'GROUP_JOIN_ACCEPTED':
      return <Users size={16} color="$purple10" />

    default:
      return <Bell size={16} color="#888" />
  }
}
