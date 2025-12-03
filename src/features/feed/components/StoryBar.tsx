import { memo, useMemo } from 'react'
import { ScrollView, StyleSheet, Pressable } from 'react-native'
import { XStack, YStack, Text, Button, useThemeName } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import StoryItem from './StoryItem'
import { useCurrentUser } from '@/hooks/useProfile'
import Avatar from '@/components/Avatar'
import { Post } from '@/types/Post'
import { LinearGradient } from 'expo-linear-gradient'
import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'
import { groupAndSortStories, getFirstUnseenStoryId } from '@/utils/StoryUtils'

function CreateStoryItem() {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const ringBackground = isDark ? '#121212' : '#ffffff'
  const labelColor = isDark ? '#f5f5f5' : '#111827'
  const currentUser = useCurrentUser()

  const handlePress = () => {
    router.push({
      pathname: '/create',
      params: { mode: 'STORY' },
    })
  }

  return (
    <Pressable onPress={handlePress}>
      <YStack alignItems="center" marginHorizontal="$2" width={74}>
        <YStack position="relative">
          <LinearGradient
            colors={INSTAGRAM_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientRing}
          >
            <YStack
              style={[styles.innerRing, { backgroundColor: ringBackground }]}
            >
              <YStack style={styles.imageWrapper}>
                <Avatar
                  uri={currentUser?.avatarUrl || undefined}
                  style={styles.image}
                />
              </YStack>
            </YStack>
            <Button
              size="$2"
              circular
              icon={<Plus size={14} color="#ffffff" />}
              backgroundColor="#0095F6"
              position="absolute"
              right={0}
              bottom={0}
              borderWidth={2}
              borderColor={ringBackground}
              padding={0}
              width={24}
              height={24}
            />
          </LinearGradient>
        </YStack>
        <Text
          numberOfLines={1}
          marginTop="$1.5"
          fontSize={12}
          color={labelColor}
          textAlign="center"
          width="100%"
        >
          Your Story
        </Text>
      </YStack>
    </Pressable>
  )
}

interface StoryBarProps {
  stories: Post[]
}

function StoryBar({ stories }: StoryBarProps) {
  const currentUser = useCurrentUser()

  const groupedStories = useMemo(() => {
    return groupAndSortStories(stories, currentUser?.id)
  }, [stories, currentUser?.id])

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 12 }}
    >
      <XStack gap="$1">
        <CreateStoryItem />
        {groupedStories.map(userStories => {
          const author = userStories[0].authorProfile
          const hasNew = userStories.some(
            story => !story.seenBy?.includes(currentUser?.id || '')
          )

          return (
            <StoryItem
              key={author.id}
              author={author}
              hasNew={hasNew}
              onPress={() => {
                const targetStoryId = getFirstUnseenStoryId(
                  userStories,
                  currentUser?.id
                )
                router.push(`/story/${targetStoryId}`)
              }}
            />
          )
        })}
      </XStack>
    </ScrollView>
  )
}

const STORY_SIZE = 64
const RING_PADDING = 4
const RING_SIZE = STORY_SIZE + RING_PADDING * 2

const styles = StyleSheet.create({
  gradientRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    padding: RING_PADDING / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: STORY_SIZE + RING_PADDING / 2,
    height: STORY_SIZE + RING_PADDING / 2,
    borderRadius: (STORY_SIZE + RING_PADDING / 2) / 2,
    padding: RING_PADDING / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})

export default memo(StoryBar)
