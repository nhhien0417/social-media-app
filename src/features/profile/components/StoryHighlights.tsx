import { memo } from 'react'
import { ScrollView, StyleSheet, Image, Pressable } from 'react-native'
import { YStack, useThemeName } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'
import { Post } from '@/types/Post'

interface StoryHighlightsProps {
  stories: Post[]
}

export const StoryHighlights = memo(function StoryHighlights({
  stories,
}: StoryHighlightsProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const ringBackground = isDark ? '#050506' : '#ffffff'
  const fallbackBackground = isDark ? '#10131a' : '#e2e8f0'

  if (!stories.length) {
    return null
  }

  const handleStoryPress = (story: Post) => {
    router.push({
      pathname: '/story/[id]',
      params: {
        id: story.id,
        mode: 'HIGHLIGHT',
        userId: story.authorProfile.id,
      },
    })
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 16 }}
    >
      {stories.map(story => {
        const coverImage = story.media?.[0]

        return (
          <Pressable key={story.id} onPress={() => handleStoryPress(story)}>
            <LinearGradient
              colors={INSTAGRAM_GRADIENT}
              start={{ x: 0, y: 0.35 }}
              end={{ x: 1, y: 0.65 }}
              style={styles.highlightRing}
            >
              <YStack
                style={[
                  styles.highlightInner,
                  { backgroundColor: ringBackground },
                ]}
              >
                <YStack style={styles.highlightImageWrapper}>
                  {coverImage ? (
                    <Image
                      source={{ uri: coverImage }}
                      style={styles.highlightImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <YStack
                      flex={1}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={fallbackBackground}
                    ></YStack>
                  )}
                </YStack>
              </YStack>
            </LinearGradient>
          </Pressable>
        )
      })}
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  highlightRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 2,
  },
  highlightInner: {
    flex: 1,
    borderRadius: 34,
    padding: 3,
  },
  highlightImageWrapper: {
    flex: 1,
    borderRadius: 31,
    overflow: 'hidden',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
})
