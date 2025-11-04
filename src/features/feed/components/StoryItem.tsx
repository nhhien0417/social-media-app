import Avatar from "@/components/Avatar"
import { Story } from "@/types/models"
import { YStack, Text } from "tamagui"

function StoryItem({ story }: { story: Story }) {
  const { author, hasNew } = story

  return (
    <YStack alignItems="center" marginHorizontal="$2" minWidth={84}>
      <YStack position="relative">
        <Avatar uri={author.avatarUrl ?? ''} size={64} />
        {hasNew && (
          <YStack
            position="absolute"
            right={-2}
            bottom={-2}
            width={20}
            height={20}
            borderRadius={999}
            backgroundColor="#1877F2"
            alignItems="center"
            justifyContent="center"
            borderColor="#fff"
            borderWidth={2}
          >
            <Text color="white" fontWeight="800">
              +
            </Text>
          </YStack>
        )}
      </YStack>
      <Text numberOfLines={1} marginTop="$1" fontSize={12} opacity={0.8}>
        {author.username}
      </Text>
    </YStack>
  )
}

export default StoryItem