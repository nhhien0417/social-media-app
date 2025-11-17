import { useState } from 'react'
import { Button, XStack, useThemeName } from 'tamagui'
import { Share2, UserPlus, UserMinus, UserCheck } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { ShareProfileSheet } from './ShareProfileSheet'
import { ProfileComponentProps } from '../ProfileScreen'
import { useProfileActions } from '@/hooks/useProfile'

export function ProfileActions({ user, isOwnProfile }: ProfileComponentProps) {
  const router = useRouter()
  const [showShare, setShowShare] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const secondaryBackground = isDark ? 'rgba(255,255,255,0.08)' : '#e3e8f1ff'
  const secondaryTextColor = isDark ? '#f5f5f5' : '#0d131eff'
  const outlineColor = isDark ? 'rgba(255,255,255,0.4)' : '#9fa2a7ff'

  const { addFriend, cancelFriend, acceptFriend, rejectFriend, unfriend } =
    useProfileActions()

  const friendStatus = user.friendStatus
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAddFriend = async () => {
    setIsProcessing(true)
    await addFriend(user.id)
    setIsProcessing(false)
  }
  
  const handleAccept = async () => {
    setIsProcessing(true)
    await acceptFriend(user.id)
    setIsProcessing(false)
  }
  
  const handleCancel = async () => {
    setIsProcessing(true)
    await cancelFriend(user.id)
    setIsProcessing(false)
  }
  
  const handleReject = async () => {
    setIsProcessing(true)
    await rejectFriend(user.id)
    setIsProcessing(false)
  }

  const handleUnfriend = async () => {
    setIsProcessing(true)
    await unfriend(user.id)
    setIsProcessing(false)
  }

  const renderFriendButton = () => {
    switch (friendStatus) {
      case 'FRIEND':
        return (
          <>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              fontSize={15}
              fontWeight={500}
              icon={<UserCheck size={18} color={secondaryTextColor} />}
              onPress={handleUnfriend}
              disabled={isProcessing}
            >
              Friends
            </Button>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              fontSize={15}
              fontWeight={500}
              onPress={() => router.push(`/message/${user.id}`)}
            >
              Message
            </Button>
          </>
        )

      case 'OUTGOING_PENDING':
        return (
          <Button
            flex={1}
            borderRadius="$5"
            backgroundColor={secondaryBackground}
            color={secondaryTextColor}
            borderColor={outlineColor}
            borderWidth={1}
            fontSize={15}
            fontWeight={500}
            icon={<UserMinus size={18} color={secondaryTextColor} />}
            onPress={handleCancel}
            disabled={isProcessing}
          >
            Cancel Request
          </Button>
        )

      case 'INCOMING_PENDING':
        return (
          <>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor="#1877F2"
              color="#ffffff"
              fontSize={15}
              fontWeight={500}
              icon={<UserPlus size={18} color="#ffffff" />}
              onPress={handleAccept}
              disabled={isProcessing}
            >
              Accept
            </Button>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              fontSize={15}
              fontWeight={500}
              onPress={handleReject}
              disabled={isProcessing}
            >
              Decline
            </Button>
          </>
        )

      case 'NONE':
      default:
        return (
          <Button
            flex={1}
            borderRadius="$5"
            backgroundColor="#1877F2"
            color="#ffffff"
            fontSize={15}
            fontWeight={500}
            icon={<UserPlus size={18} color="#ffffff" />}
            onPress={handleAddFriend}
            disabled={isProcessing}
          >
            Add Friend
          </Button>
        )
    }
  }

  return (
    <>
      <XStack gap="$3" paddingHorizontal="$3">
        {isOwnProfile ? (
          <>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              fontSize={15}
              fontWeight={500}
              onPress={() => router.push('/profile/edit')}
            >
              Edit Profile
            </Button>
            <Button
              flex={1}
              borderRadius="$5"
              backgroundColor={secondaryBackground}
              color={secondaryTextColor}
              borderColor={outlineColor}
              borderWidth={1}
              fontSize={15}
              fontWeight={500}
              icon={<Share2 size={18} color={secondaryTextColor} />}
              onPress={() => setShowShare(true)}
            >
              Share Profile
            </Button>
          </>
        ) : (
          <>{renderFriendButton()}</>
        )}
      </XStack>

      <ShareProfileSheet
        open={showShare}
        onOpenChange={setShowShare}
        user={user}
      />
    </>
  )
}
