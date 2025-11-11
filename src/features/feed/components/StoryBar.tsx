import { memo } from 'react'
import { ScrollView, Image, StyleSheet, Pressable } from 'react-native'
import { XStack, YStack, Text, Button, useThemeName } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { stories } from '@/mock/stories'
import StoryItem from './StoryItem'

const INSTAGRAM_GRADIENT = [
  '#f58529',
  '#feda77',
  '#dd2a7b',
  '#8134af',
  '#515bd4',
] as const

function CreateStoryItem() {
  const userAvatar = 'https://i.pravatar.cc/100?img=40'
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const ringBackground = isDark ? '#121212' : '#ffffff'
  const labelColor = isDark ? '#f5f5f5' : '#111827'

  const handlePress = () => {
    // TODO: Open create story screen
    console.log('Create story')
  }

  return (
    <Pressable onPress={handlePress}>
      <YStack alignItems="center" marginHorizontal="$2" width={74}>
        <YStack position="relative">
          <YStack
            style={[styles.storyRing, { backgroundColor: ringBackground }]}
            alignItems="center"
            justifyContent="center"
          >
            <YStack style={styles.storyImageWrapper}>
              <Image source={{ uri: userAvatar }} style={styles.storyImage} />
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

function StoryBar() {
  // Sort stories: new stories first, then viewed stories
  const sortedStories = [...stories].sort((a, b) => {
    if (a.hasNew === b.hasNew) return 0
    return a.hasNew ? -1 : 1
  })

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 8 }}
    >
      <XStack gap="$1">
        <CreateStoryItem />
        {sortedStories.map(s => (
          <StoryItem
            key={s.id}
            story={s}
            onPress={() => router.push(`/story/${s.id}` as any)}
          />
        ))}
      </XStack>
    </ScrollView>
  )
}

const STORY_SIZE = 64
const RING_PADDING = 4
const RING_SIZE = STORY_SIZE + RING_PADDING * 2

const styles = StyleSheet.create({
  storyRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    padding: RING_PADDING / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImageWrapper: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})

export default memo(StoryBar)
