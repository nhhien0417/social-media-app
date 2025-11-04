import Avatar from '@/components/Avatar'
import { Story } from '@/types/Story'
import React from 'react'
import { YStack, Text } from 'tamagui'

function StoryItem({ story }: { story: Story }) {
  const { author, hasNew } = story
  const borderColor = hasNew ? '$red10' : '$blue10'

  return (
    <YStack alignItems="center" marginHorizontal="$1.5" width={85}>
      <YStack
        padding={2}
        borderRadius={999}
        borderWidth={2}
        borderColor={borderColor}
      >
        <Avatar uri={author.avatarUrl} size={70} />
      </YStack>

      <Text numberOfLines={1} marginTop="$1" fontSize={13} opacity={0.8}>
        {author.username}
      </Text>
    </YStack>
  )
}

export default StoryItem
