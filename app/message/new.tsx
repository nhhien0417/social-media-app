import { useState, useEffect } from 'react'
import { FlatList, Pressable } from 'react-native'
import { Input, Text, XStack, YStack, Spinner } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { User } from '@/types/User'
import Avatar from '@/components/Avatar'
import { useChatStore } from '@/stores/chatStore'
import { useProfileStore } from '@/stores/profileStore'

export default function NewMessageScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { createGetChat, isLoading: isChatLoading } = useChatStore()
  const {
    friends,
    fetchFriends,
    isLoading: isProfileLoading,
  } = useProfileStore()

  useEffect(() => {
    fetchFriends()
  }, [])

  const filteredFriends = friends.filter(u => {
    const query = searchQuery.toLowerCase()
    const fullName = [u.firstName, u.lastName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return fullName.includes(query) || u.username.toLowerCase().includes(query)
  })

  const handleUserSelect = async (userId: string) => {
    try {
      await createGetChat(userId)
      const chat = useChatStore.getState().currentChat
      if (chat) {
        router.replace(`/message/${chat.id}`)
      }
    } catch (error) {
      console.error('Failed to create chat', error)
    }
  }

  const renderItem = ({ item }: { item: User }) => {
    const name =
      [item.firstName, item.lastName].filter(Boolean).join(' ') || item.username

    return (
      <Pressable
        onPress={() => handleUserSelect(item.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
        disabled={isChatLoading}
      >
        <XStack alignItems="center" gap="$3" paddingVertical="$3">
          <Avatar size={55} uri={item.avatarUrl || undefined} />
          <YStack>
            <Text color="$color" fontWeight="700" fontSize="$4">
              {name}
            </Text>
            <Text color="#888" fontSize="$3">
              {item.username}
            </Text>
          </YStack>
        </XStack>
      </Pressable>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background" padding="$3">
      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="$background"
      >
        <XStack alignItems="center" gap="$3">
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back()
              } else {
                router.replace('/message')
              }
            }}
            style={({ pressed }) => ({
              padding: 0,
              margin: 0,
              minWidth: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              opacity: pressed ? 0.5 : 1,
            })}
            android_ripple={{ color: '#00000010', borderless: true }}
          >
            <ChevronLeft size={22} color="$color" />
          </Pressable>

          <Text fontSize={20} fontWeight="700">
            New Message
          </Text>
        </XStack>
      </XStack>

      {/* Search Input */}
      <XStack alignItems="center" gap="$3" marginTop="$3">
        <Text fontSize="$4" color="#999">
          To:
        </Text>
        <Input
          flex={1}
          unstyled
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          fontSize="$4"
          color="$color"
          backgroundColor="transparent"
          borderWidth={0}
          focusStyle={{ borderWidth: 0 }}
        />
      </XStack>

      {/* User List */}
      <Text fontSize="$5" fontWeight="600" marginTop="$3">
        Suggestion
      </Text>

      {isProfileLoading && friends.length === 0 ? (
        <Spinner size="large" color="$color" marginTop="$5" />
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text color="#888" textAlign="center" marginTop="$5">
              No friends found
            </Text>
          }
        />
      )}
    </YStack>
  )
}
