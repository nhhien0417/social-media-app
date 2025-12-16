import { useState } from 'react'
import { FlatList, Pressable } from 'react-native'
import { Input, Text, XStack, YStack } from 'tamagui'
import { ArrowLeft, ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { mockUsers } from '@/features/messenger/data/mock'
import { User } from '@/types/User'
import Avatar from '@/components/Avatar'

export default function NewMessageScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

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
          console.log('Selected user:', item.username)
        }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
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
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$3"
    >
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

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  )
}
