import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Image, Text, XStack, YStack, useThemeName, Button } from 'tamagui'
import { Menu, PlusSquare, LogOut } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import {
  profileMock,
  ProfileTabKey,
  type ProfilePost,
} from '../../mock/profile'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileBio } from './components/ProfileBio'
import { ProfileActions } from './components/ProfileActions'
import { StoryHighlights } from './components/StoryHighlights'
import { ProfileTabBar } from './components/ProfileTabBar'
import { removeTokensAndUserId } from '@/utils/SecureStore'

const chunkMedia = (items: ProfilePost[]) => {
  const rows: ProfilePost[][] = []
  for (let index = 0; index < items.length; index += 3) {
    rows.push(items.slice(index, index + 3))
  }
  return rows
}

function MediaGrid({
  items,
  isDark,
}: {
  items: ProfilePost[]
  isDark: boolean
}) {
  const rows = useMemo(() => chunkMedia(items), [items])
  const placeholderColor = isDark ? '#1f2937' : '#e5e7eb'

  if (!items.length) {
    return (
      <YStack
        paddingHorizontal="$3"
        paddingVertical="$6"
        alignItems="center"
        gap="$2"
      >
        <Text fontSize="$5" fontWeight="600">
          No posts yet
        </Text>
        <Text
          fontSize="$3"
          color={isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'}
        >
          Once you share photos and reels, they will appear here.
        </Text>
      </YStack>
    )
  }

  return (
    <YStack gap="$1" paddingHorizontal="$1" paddingBottom="$6">
      {rows.map((row, rowIndex) => {
        const paddedRow: Array<ProfilePost | null> = [...row]
        while (paddedRow.length < 3) {
          paddedRow.push(null)
        }
        const rowKey =
          row.map(item => item.id).join('-') || `empty-row-${rowIndex}`

        return (
          <XStack key={rowKey} gap="$1">
            {paddedRow.map((item, columnIndex) => {
              if (!item) {
                return (
                  <YStack
                    key={`placeholder-${rowKey}-${columnIndex}`}
                    flex={1}
                    aspectRatio={1}
                  />
                )
              }

              return (
                <YStack
                  key={item.id}
                  flex={1}
                  aspectRatio={1}
                  overflow="hidden"
                  borderRadius="$3"
                  backgroundColor={placeholderColor}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    width="100%"
                    height="100%"
                    resizeMode="cover"
                  />
                </YStack>
              )
            })}
          </XStack>
        )
      })}
    </YStack>
  )
}

export default function ProfileScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<ProfileTabKey>('posts')
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const mediaItems = useMemo(() => {
    if (tab === 'reels') return profileMock.reels
    if (tab === 'tagged') return profileMock.tagged
    return profileMock.posts
  }, [tab])

  const pageBackground = isDark ? '#111418' : '#ffffff'
  const navIconColor = isDark ? '#f5f5f5' : '#111827'

  const handleLogout = async () => {
    await removeTokensAndUserId()
    router.replace('/auth/signin')
  }

  return (
    <YStack flex={1} backgroundColor={pageBackground}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4" paddingTop="$5" paddingBottom="$8">
          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="$3"
          >
            <Text fontSize="$6" fontWeight="700">
              {profileMock.username}
            </Text>
            <XStack gap="$3" alignItems="center">
              <PlusSquare size={22} color={navIconColor} />
              <Menu size={22} color={navIconColor} />
              <Button
                unstyled
                onPress={handleLogout}
                padding="$0"
                pressStyle={{ opacity: 0.7 }}
              >
                <LogOut size={22} color={navIconColor} />
              </Button>
            </XStack>
          </XStack>

          <ProfileHeader user={profileMock} isOwnProfile={true} />
          <ProfileActions user={profileMock} />
          <ProfileBio user={profileMock} />
          <StoryHighlights highlights={profileMock.highlights} />
          <ProfileTabBar value={tab} onChange={setTab} />
          <MediaGrid items={mediaItems} isDark={isDark} />
        </YStack>
      </ScrollView>
    </YStack>
  )
}
