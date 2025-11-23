import { memo, useEffect, useState } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Spinner,
  Text,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
import { Check, UserPlus } from '@tamagui/lucide-icons'
import { addFriendApi, getAllProfilesApi } from '@/api/api.profile'
import { getUserId } from '@/utils/SecureStore'
import { User } from '@/types/User'

interface PeopleYouMayKnowProps {
  onAddFriend?: (user: User) => void
}

export const PeopleYouMayKnow = memo(function PeopleYouMayKnow({
  onAddFriend,
}: PeopleYouMayKnowProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const titleColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.65)' : '#4b5563'
  const buttonBackground = '#1877F2'
  const buttonTextColor = '#ffffff'
  const buttonDisabledBackground = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'
  const buttonDisabledTextColor = isDark ? 'rgba(255,255,255,0.7)' : '#4b5563'

  // Fetch users from API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const profiles = await getAllProfilesApi()
        console.log('Fetched profiles:', profiles)

        // Transform API response to UserResult format
        const transformedUsers = profiles.data.map(profile => ({
          id: profile.id,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          dob: profile.dob,
        }))

        setUsers(transformedUsers)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleAddFriend = async (friendId: string) => {
    try {
      const userId = await getUserId()
      const res = await addFriendApi({
        userId: userId || '',
        friendUserId: friendId,
      })
      console.log(res)
    } catch {}
  }

  if (loading) {
    return (
      <YStack gap="$3" alignItems="center" padding="$4">
        <Spinner size="large" color={titleColor} />
        <Text fontSize="$3" color={subtitleColor}>
          Loading users...
        </Text>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack gap="$3" padding="$4">
        <Text fontSize="$4" color="red" textAlign="center">
          {error}
        </Text>
      </YStack>
    )
  }

  if (!users.length) {
    return null
  }

  return (
    <YStack gap="$3">
      <Text fontSize="$5" fontWeight="600" color={titleColor}>
        People you may know
      </Text>

      <YStack gap="$3">
        {users.map(user => (
          <XStack key={user.id} gap="$3" alignItems="center">
            <Avatar size="$5">
              <AvatarImage />
              <AvatarFallback backgroundColor={isDark ? '#1f2937' : '#e5e7eb'}>
                <Text fontWeight="700" color={titleColor}>
                  {user.id?.toUpperCase() ?? 'U'}
                </Text>
              </AvatarFallback>
            </Avatar>

            <YStack flex={1} gap="$1">
              <Text fontSize="$4" fontWeight="600" color={titleColor}>
                {user.email}
              </Text>
              <Text fontSize="$3" color={subtitleColor}>
                {user.lastName}
              </Text>
              <Text fontSize="$2" color={subtitleColor}>
                {user.dob} mutual friends
              </Text>
            </YStack>

            <Button
              size="$3"
              borderRadius={999}
              paddingHorizontal="$4"
              backgroundColor={
                !user.id ? buttonDisabledBackground : buttonBackground
              }
              color={!user.id ? buttonDisabledTextColor : buttonTextColor}
              icon={!user.id ? Check : UserPlus}
              onPress={() => handleAddFriend(user.id)}
            >
              {!user.id ? 'Friends' : 'Add friend'}
            </Button>
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
})
