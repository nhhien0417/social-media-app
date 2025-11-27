import { memo } from 'react'
import { ScrollView, StyleSheet, Image, Pressable } from 'react-native'
import { Text, YStack, useThemeName } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import type { ProfileHighlight } from '../../../mock/profile'
import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'

interface StoryHighlightsProps {
  highlights: ProfileHighlight[]
  username?: string
  avatarUrl?: string
}

export const StoryHighlights = memo(function StoryHighlights({
  highlights,
  username,
  avatarUrl,
}: StoryHighlightsProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const labelColor = isDark ? 'rgba(255,255,255,0.8)' : '#111827'
  const fallbackBackground = isDark ? '#10131a' : '#e2e8f0'
  const ringBackground = isDark ? '#050506' : '#ffffff'

  if (!highlights.length) {
    return null
  }

  const handleHighlightPress = (highlight: ProfileHighlight) => {
    router.push({
      pathname: '/story/highlight/[id]',
      params: {
        id: highlight.id,
        username: username || 'User',
        avatarUrl: avatarUrl || '',
      },
    })
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 16 }}
    >
      {highlights.map(item => (
        <Pressable key={item.id} onPress={() => handleHighlightPress(item)}>
          <YStack alignItems="center" gap="$2">
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
                  {item.coverImage ? (
                    <Image
                      source={{ uri: item.coverImage }}
                      style={styles.highlightImage}
                    />
                  ) : (
                    <YStack
                      flex={1}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={fallbackBackground}
                    >
                      <Text fontSize="$3" fontWeight="600" color="#f8fafc">
                        {item.label[0]?.toUpperCase() ?? 'S'}
                      </Text>
                    </YStack>
                  )}
                </YStack>
              </YStack>
            </LinearGradient>
            <Text fontSize="$2" color={labelColor}>
              {item.label}
            </Text>
          </YStack>
        </Pressable>
      ))}
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
    resizeMode: 'cover',
  },
})
