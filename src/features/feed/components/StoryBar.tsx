import React, { memo } from 'react'
import { ScrollView } from 'react-native'
import { XStack } from 'tamagui'
import { stories } from '@/mock/db'
import StoryItem from './StoryItem'

function StoryBar() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12 }}
    >
      <XStack>
        {stories.map((s) => (
          <StoryItem key={s.id} story={{ ...s, thumbUrl: s.thumbUrl ?? '' }} />
        ))}
      </XStack>
    </ScrollView>
  )
}

export default memo(StoryBar)
