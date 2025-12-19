import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { XStack, YStack, SizableText, Button } from 'tamagui'
import Avatar from '@/components/Avatar'
import { router } from 'expo-router'
import { User } from '@/types/User'
import { useProfileActions } from '@/hooks/useProfile'
import { UserCheck, UserMinus, UserPlus, Heart } from '@tamagui/lucide-icons'

interface LikeItemProps {
  user: User
  currentUserId?: string
  onClose?: () => void
  isLiked?: boolean
}

export default function LikeItem({
  user,
  currentUserId,
  onClose,
  isLiked,
}: LikeItemProps) {
  const isMe = currentUserId === user.id

  const { addFriend, cancelFriend, acceptFriend, rejectFriend, unfriend } =
    useProfileActions()

  const [isProcessing, setIsProcessing] = useState(false)
  const [friendStatus, setFriendStatus] = useState(user.friendStatus)

  const handleAddFriend = async () => {
    setIsProcessing(true)
    await addFriend(user.id)
    setFriendStatus('OUTGOING_PENDING')
    setIsProcessing(false)
  }

  const handleAccept = async () => {
    setIsProcessing(true)
    await acceptFriend(user.id)
    setFriendStatus('FRIEND')
    setIsProcessing(false)
  }

  const handleCancel = async () => {
    setIsProcessing(true)
    await cancelFriend(user.id)
    setFriendStatus('NONE')
    setIsProcessing(false)
  }

  const handleReject = async () => {
    setIsProcessing(true)
    await rejectFriend(user.id)
    setFriendStatus('NONE')
    setIsProcessing(false)
  }

  const handleUnfriend = async () => {
    setIsProcessing(true)
    await unfriend(user.id)
    setFriendStatus('NONE')
    setIsProcessing(false)
  }

  const renderFriendButton = () => {
    switch (friendStatus) {
      case 'FRIEND':
        return (
          <Button
            size="$3"
            borderRadius="$5"
            backgroundColor="$background"
            color="$color"
            borderWidth={1}
            fontSize={13}
            fontWeight="600"
            icon={<UserCheck size={16} color="$color" />}
            onPress={handleUnfriend}
            disabled={isProcessing}
            paddingHorizontal="$3"
          >
            Friends
          </Button>
        )

      case 'OUTGOING_PENDING':
        return (
          <Button
            size="$3"
            borderRadius="$5"
            backgroundColor="$background"
            color="$color"
            borderColor="$borderColor"
            borderWidth={1}
            fontSize={13}
            fontWeight="600"
            icon={<UserMinus size={16} color="$color" />}
            onPress={handleCancel}
            disabled={isProcessing}
            paddingHorizontal="$3"
          >
            Cancel
          </Button>
        )

      case 'INCOMING_PENDING':
        return (
          <XStack gap="$2">
            <Button
              size="$3"
              borderRadius="$5"
              backgroundColor="#1877F2"
              color="#ffffff"
              fontSize={13}
              fontWeight="600"
              onPress={handleAccept}
              disabled={isProcessing}
              paddingHorizontal="$3"
            >
              Accept
            </Button>
            <Button
              size="$3"
              borderRadius="$5"
              backgroundColor="$background"
              color="$color"
              borderColor="$borderColor"
              borderWidth={1}
              fontSize={13}
              fontWeight="600"
              onPress={handleReject}
              disabled={isProcessing}
              paddingHorizontal="$3"
            >
              Decline
            </Button>
          </XStack>
        )

      case 'NONE':
      default:
        return (
          <Button
            size="$3"
            borderRadius="$5"
            backgroundColor="#1877F2"
            color="#ffffff"
            fontSize={13}
            fontWeight="600"
            icon={<UserPlus size={16} color="#ffffff" />}
            onPress={handleAddFriend}
            disabled={isProcessing}
            paddingHorizontal="$3"
          >
            Follow
          </Button>
        )
    }
  }

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical="$3"
      paddingHorizontal="$4"
    >
      <TouchableOpacity
        onPress={() => {
          onClose?.()
          if (currentUserId && user.id === currentUserId) {
            router.push('/(tabs)/profile')
          } else {
            router.push({
              pathname: '/profile/[id]',
              params: { id: user.id },
            })
          }
        }}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
      >
        <YStack position="relative">
          <Avatar uri={user.avatarUrl || undefined} size={44} />
          {isLiked && (
            <YStack
              position="absolute"
              bottom={-3}
              right={-3}
              backgroundColor="#ff3040"
              borderRadius={20}
              width={20}
              height={20}
              alignItems="center"
              justifyContent="center"
              borderWidth={1.5}
              borderColor="$background"
            >
              <Heart size={12} color="white" fill="white" />
            </YStack>
          )}
        </YStack>
        <YStack marginLeft="$3" flex={1}>
          <SizableText fontWeight="700" fontSize={14} color="$color">
            {user.username}
          </SizableText>
          <SizableText fontSize={13} color="#888" numberOfLines={1}>
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email}
          </SizableText>
        </YStack>
      </TouchableOpacity>

      {!isMe && renderFriendButton()}
    </XStack>
  )
}
