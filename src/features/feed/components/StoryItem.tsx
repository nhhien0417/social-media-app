import { User } from '@/types/User'
import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { YStack, Text, useThemeName } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { INSTAGRAM_GRADIENT } from '@/utils/InstagramGradient'
import Avatar from '@/components/Avatar'

interface StoryItemProps {
  author: User
  hasNew: boolean
  onPress?: () => void
}

function StoryItem({ author, hasNew, onPress }: StoryItemProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const ringBackground = isDark ? '#121212' : '#ffffff'
  const labelColor = isDark ? '#f5f5f5' : '#111827'
  const viewedRingColor = isDark ? '#3a3a3a' : '#dbdbdb'

  return (
    <Pressable onPress={onPress}>
      <YStack alignItems="center" marginHorizontal="$2" width={74}>
        {hasNew ? (
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
                  uri={author.avatarUrl || undefined}
                  style={styles.image}
                  objectFit="cover"
                />
              </YStack>
            </YStack>
          </LinearGradient>
        ) : (
          <YStack
            style={[
              styles.viewedRing,
              {
                borderColor: viewedRingColor,
                backgroundColor: ringBackground,
              },
            ]}
          >
            <YStack style={styles.imageWrapper}>
              <Avatar
                uri={author.avatarUrl || undefined}
                style={styles.image}
                objectFit="cover"
              />
            </YStack>
          </YStack>
        )}
        <Text
          numberOfLines={1}
          marginTop="$1.5"
          fontSize={12}
          color={labelColor}
          textAlign="center"
          width="100%"
        >
          {author.username}
        </Text>
      </YStack>
    </Pressable>
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
  viewedRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    padding: RING_PADDING / 2,
    borderWidth: 2,
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
  },
})

export default StoryItem
