import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, StyleSheet } from 'react-native'
import { YStack, XStack, Text, Spinner } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useMemo, useEffect, useState } from 'react'
import PostCard from '@/features/feed/components/PostCard'
import { useProfileStore } from '@/stores/profileStore'
import ButtonIcon from '@/components/IconButton'
import { useAppTheme } from '@/providers/ThemeProvider'

export default function ProfileFeedScreen() {
  const router = useRouter()
  const { initialPostId, userId } = useLocalSearchParams<{
    initialPostId: string
    userId: string
  }>()
  const { theme } = useAppTheme()
  const isDark = theme === 'dark'

  const { currentUser, users, fetchUser } = useProfileStore()
  const displayUser = userId ? users[userId] : currentUser

  useEffect(() => {
    if (userId && !users[userId]) {
      console.log('Fetching user:', userId)
      fetchUser(userId)
    }
  }, [userId, users, fetchUser])

  const posts = useMemo(() => {
    const userPosts = Array.isArray(displayUser?.posts) ? displayUser.posts : []
    return userPosts.map(post => ({
      ...post,
      authorProfile: post.authorProfile || displayUser,
    }))
  }, [displayUser])

  const initialScrollIndex = useMemo(() => {
    if (!initialPostId) return 0
    const index = posts.findIndex(p => p.id === initialPostId)
    return index !== -1 ? index : 0
  }, [posts, initialPostId])

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (posts.length > 0) {
      setIsReady(true)
    } else if (
      displayUser &&
      (!displayUser.posts || displayUser.posts.length === 0)
    ) {
      setIsReady(true)
    }
  }, [posts, displayUser])

  if (!displayUser) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        paddingHorizontal="$2"
        paddingVertical="$2"
        alignItems="center"
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderColor="$borderColor"
      >
        <ButtonIcon
          Icon={ChevronLeft}
          onPress={() => router.back()}
          Color={isDark ? 'white' : 'black'}
        />
        <Text fontSize="$6" fontWeight="700" marginLeft="$2">
          {displayUser.username}
        </Text>
      </XStack>

      {isReady ? (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          initialScrollIndex={
            initialScrollIndex !== -1 ? initialScrollIndex : 0
          }
          getItemLayout={(_data, index) => ({
            length: 500,
            offset: 500 * index,
            index,
          })}
          onScrollToIndexFailed={() => {
            const wait = new Promise(resolve => setTimeout(resolve, 500))
            wait.then(() => {})
          }}
        />
      ) : (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" />
        </YStack>
      )}
    </YStack>
  )
}
