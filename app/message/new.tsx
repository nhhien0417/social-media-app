import { useState } from 'react'
import { FlatList, Pressable } from 'react-native'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Text,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { mockUsers } from '@/features/messenger/data/mock'
import { User } from '@/types/User'

export default function NewMessageScreen() {
  const router = useRouter()
  const theme = useThemeName()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter users based on search query
  // Exclude 'me' from the list
  const users = Object.values(mockUsers)
    .filter(u => u.id !== 'me')
    .filter(u => {
      const query = searchQuery.toLowerCase()
      const fullName = [u.firstName, u.lastName].join(' ').toLowerCase()
      return (
        fullName.includes(query) || u.username.toLowerCase().includes(query)
      )
    })

  const renderItem = ({ item }: { item: User }) => {
    const name =
      [item.firstName, item.lastName].filter(Boolean).join(' ') || item.username

    return (
      <Pressable
        onPress={() => {
          // In a real app, this would check if a chat exists and navigate to it, or create a new one.
          // For now, we'll just go back or log it.
          // router.push(`/message/${existingChatId}`)
          console.log('Selected user:', item.username)
        }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <XStack alignItems="center" gap="$3" paddingVertical="$2">
          <Avatar circular size="$4.5">
            <AvatarImage source={{ uri: item.avatarUrl || undefined }} />
            <AvatarFallback backgroundColor="$gray5" />
          </Avatar>

          <YStack>
            <Text color="$color" fontWeight="700" fontSize="$4">
              {name}
            </Text>
            <Text color="$gray10" fontSize="$3">
              {item.username}
            </Text>
          </YStack>
        </XStack>
      </Pressable>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" paddingTop="$8">
      {/* Header */}
      <XStack alignItems="center" gap="$4" marginBottom="$6">
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={24} color="$color" />
        </Pressable>
        <Text fontSize={20} fontWeight="700">
          Tin nhắn mới
        </Text>
      </XStack>

      {/* Search Input */}
      <XStack alignItems="center" marginBottom="$6" gap="$3">
        <Text fontSize="$4" color="$gray10">
          Đến:
        </Text>
        <Input
          flex={1}
          unstyled
          placeholder="Tìm kiếm"
          placeholderTextColor="$gray9"
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
      <Text fontSize="$4" fontWeight="600" marginBottom="$4">
        Gợi ý
      </Text>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </YStack>
  )
}
