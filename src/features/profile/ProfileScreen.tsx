import { useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { Text, XStack, YStack, useThemeName, Button } from 'tamagui'
import { Menu, PlusSquare, LogOut } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { ProfileInfo } from './components/ProfileInfo'
import { ProfileBio } from './components/ProfileBio'
import { ProfileActions } from './components/ProfileActions'
import { StoryHighlights } from './components/StoryHighlights'
import { ProfileTabBar } from './components/ProfileTabBar'
import { removeTokensAndUserId } from '@/utils/SecureStore'
import { useCurrentUser } from '@/services/useCurrentUser'
import MediaGrid from './components/MediaGrid'
import { profileMock } from '@/mock/profile'
import { User } from '@/types/User'

export type ProfileTabKey = 'posts' | 'reels' | 'tagged'

export interface ProfileProps {
  user: User
  isOwnProfile: boolean
}

export default function ProfileScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<ProfileTabKey>('posts')
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const { data: currentUser, isLoading, error } = useCurrentUser()

  const posts = Array.isArray(currentUser?.posts) ? currentUser.posts : []
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

  if (error || !currentUser) {
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
        <Button onPress={handleLogout}>Go to Login</Button>
      </YStack>
    )
  }

  if (!currentUser) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="$6" fontWeight="700">
          Loading...
        </Text>
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
            <Text fontSize="$7" fontWeight="700">
              {currentUser.username}
            </Text>
            <XStack gap="$3" alignItems="center">
              <PlusSquare size={25} color={navIconColor} />
              <Menu size={25} color={navIconColor} />

              <LogOut
                onPress={handleLogout}
                padding="$0"
                pressStyle={{ opacity: 0.7 }}
                size={25}
                color={navIconColor}
              />
            </XStack>
          </XStack>

          <ProfileInfo user={currentUser} isOwnProfile={true} />
          <ProfileBio user={currentUser} isOwnProfile={true} />
          <ProfileActions user={currentUser} isOwnProfile={true} />
          <StoryHighlights highlights={profileMock.highlights} />
          <ProfileTabBar value={tab} onChange={setTab} />
          <MediaGrid items={mediaItems} isDark={isDark} />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
