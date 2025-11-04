import { memo } from 'react'
import { ScrollView } from 'react-native'
import { XStack, YStack, Text, Button } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'
import { stories } from '@/mock/db'
import Avatar from '@/components/Avatar'
import StoryItem from './StoryItem'

function CreateStoryItem() {
  const userAvatar = 'https://i.pravatar.cc/100?img=40'

  return (
    <YStack alignItems="center" marginHorizontal="$1.5" width={85}>
      <YStack
        padding={2}
        borderRadius={999}
        borderWidth={2}
        borderColor="$red10"
      >
        <Avatar uri={userAvatar} size={70} />
        <Button
          size="$2"
          circular
          icon={Plus}
          backgroundColor="$blue10"
          color="white"
          position="absolute"
          right={0}
          bottom={0}
          borderWidth={3}
          borderColor="white"
        />
      </YStack>
      <Text numberOfLines={1} marginTop="$1" fontSize={13} opacity={0.8}>
        Your Story
      </Text>
    </YStack>
  )
}

function StoryBar() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
    >
      <XStack>
        <CreateStoryItem />
        {stories.map(s => (
          <StoryItem key={s.id} story={{ ...s, thumbUrl: s.thumbUrl ?? '' }} />
        ))}
      </XStack>
    </ScrollView>
  )
}

export default memo(StoryBar)
