import { memo } from 'react'
import { ScrollView, Pressable } from 'react-native'
import { XStack, YStack, Text, useThemeName } from 'tamagui'
import { useRouter } from 'expo-router'
import Avatar from '@/components/Avatar'
import { useChatStore } from '@/stores/chatStore'
import { useProfileStore } from '@/stores/profileStore'
import { User } from '@/types/User'

interface OnlineFriendItemProps {
  friend: User
  isOnline: boolean
  onPress: () => void
  isLoading: boolean
}

function OnlineFriendItem({
  friend,
  isOnline,
  onPress,
  isLoading,
}: OnlineFriendItemProps) {
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const labelColor = isDark ? '#f5f5f5' : '#111827'
  const ringBackground = isDark ? '#121212' : '#ffffff'

  const name =
    [friend.firstName, friend.lastName].filter(Boolean).join(' ') ||
    friend.username

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => ({
        opacity: pressed || isLoading ? 0.6 : 1,
      })}
    >
      <YStack alignItems="center" marginHorizontal="$2" width={70}>
        <YStack position="relative">
          <Avatar size={60} uri={friend.avatarUrl || undefined} />
          {isOnline && (
            <YStack
              position="absolute"
              bottom={0}
              right={0}
              width={20}
              height={20}
              backgroundColor="#22C55E"
              borderRadius={10}
              borderWidth={3}
              borderColor={ringBackground}
            />
          )}
        </YStack>
        <Text
          numberOfLines={1}
          marginTop="$2"
          fontSize={12}
          color={labelColor}
          textAlign="center"
          width="100%"
        >
          {name}
        </Text>
      </YStack>
    </Pressable>
  )
}

function OnlineFriendsBar() {
  const router = useRouter()
  const {
    onlineUsers,
    createGetChat,
    isLoading: isChatLoading,
  } = useChatStore()
  const { friends } = useProfileStore()

  const handleFriendPress = async (friendId: string) => {
    try {
      await createGetChat(friendId)
      const chat = useChatStore.getState().currentChat
      if (chat) {
        router.push(`/message/${chat.id}`)
      }
    } catch (error) {
      console.error('Failed to create/get chat:', error)
    }
  }

  if (friends.length === 0) {
    return null
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 8 }}
    >
      <XStack gap="$1">
        {friends.map(friend => (
          <OnlineFriendItem
            key={friend.id}
            friend={friend}
            isOnline={onlineUsers.has(friend.id)}
            onPress={() => handleFriendPress(friend.id)}
            isLoading={isChatLoading}
          />
        ))}
      </XStack>
    </ScrollView>
  )
}

export default memo(OnlineFriendsBar)
