import { useState } from 'react'
import { Button, XStack, useThemeName } from 'tamagui'
import { Share2, UserPlus, UserMinus, UserCheck } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShareProfileSheet } from './ShareProfileSheet'
import { ProfileComponentProps } from '../ProfileScreen'
import {
  addFriendApi,
  acceptFriendApi,
  rejectFriendAPi,
} from '@/api/api.profile'
import { getUserId } from '@/utils/SecureStore'

export function ProfileActions({ user, isOwnProfile }: ProfileComponentProps) {
  const router = useRouter()
  const [showShare, setShowShare] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const secondaryBackground = isDark ? 'rgba(255,255,255,0.08)' : '#e3e8f1ff'
  const secondaryTextColor = isDark ? '#f5f5f5' : '#0d131eff'
  const outlineColor = isDark ? 'rgba(255,255,255,0.4)' : '#9fa2a7ff'
  const queryClient = useQueryClient()

  // Mutations
  const addFriendMutation = useMutation({
    mutationFn: async () => {
      const currentUserId = await getUserId()
      if (!currentUserId) throw new Error('Not logged in')
      return addFriendApi({ userId: currentUserId, friendUserId: user.id })
    },
    onSuccess: data => {
      console.log('Success request friend:', data)
      queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] })
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] })
      queryClient.invalidateQueries({ queryKey: ['sent'] })
    },
  })

  const acceptFriendMutation = useMutation({
    mutationFn: async () => {
      const currentUserId = await getUserId()
      if (!currentUserId) throw new Error('Not logged in')
      return acceptFriendApi({ userId: currentUserId, friendUserId: user.id })
    },
    onSuccess: data => {
      console.log('Success accept friend:', data)
      queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['pending'] })
    },
  })

  const cancelFriendMutation = useMutation({
    mutationFn: async () => {
      const currentUserId = await getUserId()
      if (!currentUserId) throw new Error('Not logged in')
      return rejectFriendAPi({ userId: currentUserId, friendUserId: user.id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user.id] })
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['pending'] })
      queryClient.invalidateQueries({ queryKey: ['sent'] })
    },
  })

  const friendStatus = user.friendStatus
  const isPending =
    addFriendMutation.isPending ||
    acceptFriendMutation.isPending ||
    cancelFriendMutation.isPending

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
              onPress={() => cancelFriendMutation.mutate()}
              disabled={isPending}
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
            onPress={() => cancelFriendMutation.mutate()}
            disabled={isPending}
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
              onPress={() => acceptFriendMutation.mutate()}
              disabled={isPending}
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
              onPress={() => cancelFriendMutation.mutate()}
              disabled={isPending}
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
            onPress={() => addFriendMutation.mutate()}
            disabled={isPending}
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
