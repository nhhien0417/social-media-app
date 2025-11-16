import { useMemo, useState, useEffect } from 'react'
import { ActivityIndicator, Pressable, ScrollView } from 'react-native'
import { Text, XStack, YStack, useThemeName, Button } from 'tamagui'
import { LogOut, ChevronLeft, MoreVertical, Plus } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { ProfileInfo } from './components/ProfileInfo'
import { ProfileBio } from './components/ProfileBio'
import { ProfileActions } from './components/ProfileActions'
import { StoryHighlights } from './components/StoryHighlights'
import { ProfileTabBar } from './components/ProfileTabBar'
import { removeTokensAndUserId, getUserId } from '@/utils/SecureStore'
import { useCurrentUser, useUserProfile } from '@/services/useProfile'
import MediaGrid from './components/MediaGrid'
import { profileMock } from '@/mock/profile'
import { User } from '@/types/User'

export type ProfileTabKey = 'posts' | 'reels' | 'tagged'

export interface ProfileScreenProps {
  userId?: string
}

export interface ProfileComponentProps {
  user: User
  isOwnProfile: boolean
}

export default function ProfileScreen({ userId }: ProfileScreenProps) {
  const router = useRouter()
  const [tab, setTab] = useState<ProfileTabKey>('posts')
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    getUserId().then(setCurrentUserId)
  }, [])

  const { data: currentUser } = useCurrentUser()
  const {
    data: otherUser,
    isLoading: otherUserLoading,
    error: otherUserError,
  } = useUserProfile(userId)

  const displayUser = userId ? otherUser : currentUser
  const isOwnProfile = !userId || userId === currentUserId
  const isLoading = userId ? otherUserLoading : !currentUser
  const error = userId ? otherUserError : !currentUser && !isLoading

  const posts = Array.isArray(displayUser?.posts) ? displayUser.posts : []
  const mediaItems = useMemo(() => {
    return posts
  }, [posts, tab])

  const navIconColor = isDark ? '#f5f5f5' : '#111827'

  const handleLogout = async () => {
    await removeTokensAndUserId()
    router.replace('/auth/signin')
  }

  if (isLoading) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
      >
        <ActivityIndicator size="large" />
      </YStack>
    )
  }

  if (error || !displayUser) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
        gap="$3"
      >
        <Text fontSize="$6" fontWeight="700">
          Unable to load profile
        </Text>
        {isOwnProfile && <Button onPress={handleLogout}>Go to Login</Button>}
        {!isOwnProfile && (
          <Button onPress={() => router.back()}>Go Back</Button>
        )}
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$3" paddingVertical="$3">
          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="$3"
          >
            {!isOwnProfile && (
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <ChevronLeft size={25} color={navIconColor} marginRight={8} />
              </Pressable>
            )}

            <Text fontSize="$7" fontWeight="700" flex={1}>
              {displayUser.username}
            </Text>

            <XStack gap="$3" alignItems="center">
              <Plus size={25} color={navIconColor} />
              <MoreVertical size={25} color={navIconColor} />
              <LogOut
                onPress={handleLogout}
                pressStyle={{ opacity: 0.7 }}
                size={25}
                color={navIconColor}
              />
            </XStack>
          </XStack>

          <ProfileInfo user={displayUser} isOwnProfile={isOwnProfile} />
          <ProfileBio user={displayUser} isOwnProfile={isOwnProfile} />
          <ProfileActions user={displayUser} isOwnProfile={isOwnProfile} />
          <StoryHighlights highlights={profileMock.highlights} />
          <ProfileTabBar value={tab} onChange={setTab} />
          <MediaGrid items={mediaItems} isDark={isDark} />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
