import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView } from 'react-native'
import { Text, XStack, YStack, useThemeName, Button } from 'tamagui'
import { ChevronLeft, Menu, Plus } from '@tamagui/lucide-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ProfileInfo } from './components/ProfileInfo'
import { ProfileBio } from './components/ProfileBio'
import { ProfileActions } from './components/ProfileActions'
import { StoryHighlights } from './components/StoryHighlights'
import {
  useCurrentUser,
  useCurrentUserId,
  useUser,
  useInitProfile,
} from '@/hooks/useProfile'
import MediaGrid from './components/MediaGrid'

import { User } from '@/types/User'
import SettingsSheet from './components/SettingsSheet'
import LogoutConfirmModal from './components/LogoutConfirmModal'
import { removeTokensAndUserId } from '@/utils/SecureStore'
import { useAppTheme } from '@/providers/ThemeProvider'
import { usePostStore } from '@/stores/postStore'
import { Post } from '@/types/Post'

export interface ProfileComponentProps {
  user: User
  isOwnProfile: boolean
}

export default function ProfileScreen() {
  const { id: userId } = useLocalSearchParams<{ id: string }>()

  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  useInitProfile()

  const currentUser = useCurrentUser()
  const currentUserId = useCurrentUserId()
  const otherUser = useUser(userId)

  const displayUser = userId ? otherUser : currentUser
  const isOwnProfile = !userId || userId === currentUser?.id
  const isLoading = !displayUser
  const displayUserId = displayUser?.id

  const fetchUserStories = usePostStore(state => state.fetchUserStories)
  const fetchUserPosts = usePostStore(state => state.fetchUserPosts)

  useEffect(() => {
    if (displayUserId) {
      fetchUserStories(displayUserId)
      fetchUserPosts(displayUserId)
    }
  }, [displayUserId, fetchUserStories, fetchUserPosts])

  const userStoriesData = usePostStore(state =>
    displayUser ? state.userStories[displayUser.id] : undefined
  )
  const userStories = userStoriesData || []

  const userPostsData = usePostStore(state =>
    displayUser ? state.userPosts[displayUser.id] : undefined
  )
  const userPosts = userPostsData || []

  const filteredPosts = useMemo(() => {
    return userPosts.filter((p: Post) => p.media && p.media.length > 0)
  }, [userPosts])

  const navIconColor = isDark ? '#f5f5f5' : '#111827'
  const { toggleTheme } = useAppTheme()

  const handleLogout = async () => {
    await removeTokensAndUserId()
    router.replace('/auth/signin')
  }

  const handleToggleTheme = () => {
    toggleTheme()
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

  const handleGroupsPress = () => {
    if (isOwnProfile) {
      router.push('/profile/groups')
    } else if (displayUser) {
      router.push({
        pathname: '/profile/groups',
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
        <YStack gap="$5" paddingVertical="$3">
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

            {isOwnProfile && (
              <XStack gap="$3" alignItems="center">
                <Pressable hitSlop={8} onPress={handleCreatePost}>
                  <Plus size={25} color={navIconColor} />
                </Pressable>
                <Pressable hitSlop={8} onPress={() => setShowSettings(true)}>
                  <Menu size={25} color={navIconColor} />
                </Pressable>
              </XStack>
            )}
          </XStack>

          <ProfileInfo
            user={displayUser}
            isOwnProfile={isOwnProfile}
            onFriendsPress={handleFriendsPress}
            onGroupsPress={handleGroupsPress}
            onPostsPress={handlePostsPress}
          />
          <ProfileBio user={displayUser} isOwnProfile={isOwnProfile} />
          {(isOwnProfile || currentUserId) && (
            <ProfileActions user={displayUser} isOwnProfile={isOwnProfile} />
          )}
          <StoryHighlights stories={userStories} />
          <MediaGrid
            items={filteredPosts}
            isDark={isDark}
            userId={displayUser.id}
          />
        </YStack>
      </ScrollView>

      {/* Settings Modal */}
      <SettingsSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onToggleTheme={handleToggleTheme}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        visible={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </YStack>
  )
}
