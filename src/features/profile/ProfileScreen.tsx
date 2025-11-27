import { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView } from 'react-native'
import { Text, XStack, YStack, useThemeName, Button } from 'tamagui'
import { LogOut, ChevronLeft, MoreVertical, Plus } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { ProfileInfo } from './components/ProfileInfo'
import { ProfileBio } from './components/ProfileBio'
import { ProfileActions } from './components/ProfileActions'
import { StoryHighlights } from './components/StoryHighlights'
import { ProfileTabBar } from './components/ProfileTabBar'
import { removeTokensAndUserId } from '@/utils/SecureStore'
import { useCurrentUser, useUser } from '@/hooks/useProfile'
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

  const currentUser = useCurrentUser()
  const otherUser = useUser(userId)

  const displayUser = userId ? otherUser : currentUser
  const isOwnProfile = !userId || userId === currentUser?.id
  const isLoading = !displayUser

  const posts = Array.isArray(displayUser?.posts) ? displayUser.posts : []
  const filteredPosts = useMemo(() => {
    if (tab === 'posts') {
      return posts.filter(p => p.media && p.media.length > 0)
    }
    return posts
  }, [posts, tab])

  const navIconColor = isDark ? '#f5f5f5' : '#111827'

  const handleLogout = async () => {
    await removeTokensAndUserId()
    router.replace('/auth/signin')
  }

  const handleFriendsPress = () => {
    if (isOwnProfile) {
      router.push({
        pathname: '/profile/friends',
        params: { isOwnProfile: 'true' },
      })
    } else if (displayUser) {
      router.push({
        pathname: '/profile/friends',
        params: { userId: displayUser.id, isOwnProfile: 'false' },
      })
    }
  }

  const handlePostsPress = () => {
    if (displayUser) {
      router.push({
        pathname: '/profile/feed',
        params: {
          userId: displayUser.id,
          isOwnProfile: isOwnProfile.toString(),
        },
      })
    }
  }

  const handleCreatePost = () => {
    router.push('/create')
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

  if (!displayUser) {
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
                <ChevronLeft size={25} color={navIconColor} />
              </Pressable>
            )}

            <Text
              fontSize="$7"
              fontWeight="700"
              flex={1}
              marginLeft={!isOwnProfile ? '$3' : 0}
            >
              {displayUser.username}
            </Text>

            <XStack gap="$3" alignItems="center">
              {isOwnProfile ? (
                <>
                  <Pressable hitSlop={8} onPress={handleCreatePost}>
                    <Plus size={25} color={navIconColor} />
                  </Pressable>
                  <Pressable hitSlop={8}>
                    <MoreVertical size={25} color={navIconColor} />
                  </Pressable>
                  <Pressable onPress={handleLogout} hitSlop={8}>
                    <LogOut size={25} color={navIconColor} />
                  </Pressable>
                </>
              ) : (
                <Pressable hitSlop={8}>
                  <MoreVertical size={25} color={navIconColor} />
                </Pressable>
              )}
            </XStack>
          </XStack>

          <ProfileInfo
            user={displayUser}
            isOwnProfile={isOwnProfile}
            onFriendsPress={handleFriendsPress}
            onPostsPress={handlePostsPress}
          />
          <ProfileBio user={displayUser} isOwnProfile={isOwnProfile} />
          <ProfileActions user={displayUser} isOwnProfile={isOwnProfile} />
          <StoryHighlights
            highlights={profileMock.highlights}
            username={displayUser.username}
            avatarUrl={displayUser.avatarUrl}
          />
          <ProfileTabBar value={tab} onChange={setTab} />
          <MediaGrid
            items={filteredPosts}
            isDark={isDark}
            userId={displayUser.id}
          />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
