import { useState } from 'react'
import { ScrollView, Pressable, Image, StyleSheet } from 'react-native'
import { YStack, XStack, Text, Input, Button, useThemeName } from 'tamagui'
import { ChevronLeft, Search, X, Check, UserPlus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { users } from '@/mock/users'

type TabKey = 'friends' | 'received' | 'sent' | 'mutual'

interface Friend {
  id: string
  username: string
  name: string
  avatarUrl: string
  mutualFriends?: number
  isFriend?: boolean
  isPending?: boolean
}

interface FriendsScreenProps {
  isOwnProfile?: boolean
}

export default function FriendsScreen({
  isOwnProfile = true,
}: FriendsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(
    isOwnProfile ? 'friends' : 'friends'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const backgroundColor = isDark ? '#000000' : '#FAFAFA' // Instagram colors
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const borderColor = isDark ? '#262626' : '#DBDBDB' // Instagram borders
  const searchBackground = isDark ? 'rgba(255,255,255,0.08)' : '#EFEFEF'
  const tabActiveColor = isDark ? '#ffffff' : '#111827'
  const tabInactiveColor = isDark ? 'rgba(255,255,255,0.6)' : '#9ca3af'
  const buttonBackground = '#0095F6'
  const buttonTextColor = '#ffffff'

  // Mock data
  const mockFriends: Friend[] = users.slice(0, 10).map((u, i) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    avatarUrl: u.avatarUrl,
    mutualFriends: Math.floor(Math.random() * 20),
    isFriend: i % 3 === 0,
    isPending: i % 3 === 1,
  }))

  // Tabs config based on profile type
  const tabs = isOwnProfile
    ? [
        { key: 'friends' as const, label: 'Friends', count: 124 },
        { key: 'received' as const, label: 'Requests', count: 7 },
        { key: 'sent' as const, label: 'Sent', count: 3 },
      ]
    : [
        { key: 'friends' as const, label: 'Friends', count: 124 },
        { key: 'mutual' as const, label: 'Mutual', count: 12 },
      ]

  const filteredFriends = mockFriends.filter(
    f =>
      f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderFriendItem = (friend: Friend) => {
    const showMessageButton = activeTab === 'friends'
    const showAcceptRejectButtons = activeTab === 'received'
    const showCancelButton = activeTab === 'sent'

    return (
      <XStack
        key={friend.id}
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        gap="$3"
      >
        <YStack style={styles.avatar}>
          <Image
            source={{ uri: friend.avatarUrl }}
            style={styles.avatarImage}
          />
        </YStack>

        <YStack flex={1} gap="$0.5">
          <Text fontSize={14} fontWeight="600" color={textColor}>
            {friend.username}
          </Text>
          <Text fontSize={13} color={subtitleColor}>
            {friend.name}
          </Text>
          {friend.mutualFriends !== undefined && friend.mutualFriends > 0 && (
            <Text fontSize={12} color={subtitleColor}>
              {friend.mutualFriends} mutual friends
            </Text>
          )}
        </YStack>

        {showMessageButton && (
          <Button
            size="$3"
            backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
            color={textColor}
            borderRadius={8}
            paddingHorizontal="$4"
            fontWeight="600"
            fontSize={14}
            pressStyle={{ opacity: 0.8 }}
          >
            Message
          </Button>
        )}

        {showAcceptRejectButtons && (
          <XStack gap="$2">
            <Button
              size="$3"
              backgroundColor={buttonBackground}
              color={buttonTextColor}
              borderRadius={8}
              paddingHorizontal="$4"
              fontWeight="600"
              fontSize={14}
              pressStyle={{ opacity: 0.8 }}
            >
              Accept
            </Button>
            <Button
              size="$3"
              backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
              color={textColor}
              borderRadius={8}
              paddingHorizontal="$4"
              fontWeight="600"
              fontSize={14}
              pressStyle={{ opacity: 0.8 }}
            >
              Delete
            </Button>
          </XStack>
        )}

        {showCancelButton && (
          <Button
            size="$3"
            backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
            color={textColor}
            borderRadius={8}
            paddingHorizontal="$4"
            fontWeight="600"
            fontSize={14}
            pressStyle={{ opacity: 0.8 }}
          >
            Cancel
          </Button>
        )}
      </XStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      {/* Header */}
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderColor={borderColor}
        gap="$3"
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={28} color={textColor} />
        </Pressable>
        <Text fontSize={20} fontWeight="700" color={textColor} flex={1}>
          hien.npdang
        </Text>
      </XStack>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        style={{ maxHeight: 60 }}
      >
        <XStack gap="$3">
          {tabs.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderBottomWidth: activeTab === tab.key ? 2 : 0,
                borderBottomColor:
                  activeTab === tab.key ? textColor : 'transparent',
              }}
            >
              <XStack gap="$1.5" alignItems="center">
                <Text
                  fontSize={15}
                  fontWeight={activeTab === tab.key ? '600' : '400'}
                  color={
                    activeTab === tab.key ? tabActiveColor : tabInactiveColor
                  }
                >
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <YStack
                    backgroundColor={
                      isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'
                    }
                    borderRadius={10}
                    paddingHorizontal={6}
                    paddingVertical={2}
                    minWidth={20}
                    alignItems="center"
                  >
                    <Text
                      fontSize={12}
                      fontWeight="600"
                      color={
                        activeTab === tab.key
                          ? tabActiveColor
                          : tabInactiveColor
                      }
                    >
                      {tab.count}
                    </Text>
                  </YStack>
                )}
              </XStack>
            </Pressable>
          ))}
        </XStack>
      </ScrollView>

      {/* Search */}
      <YStack paddingHorizontal="$4" paddingVertical="$3">
        <XStack
          backgroundColor={searchBackground}
          borderRadius={10}
          paddingHorizontal="$3"
          paddingVertical="$2"
          alignItems="center"
          gap="$2"
        >
          <Search size={20} color={subtitleColor} />
          <Input
            flex={1}
            placeholder="Search"
            placeholderTextColor={subtitleColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            backgroundColor="transparent"
            borderWidth={0}
            fontSize={15}
            color={textColor}
            paddingHorizontal={0}
            paddingVertical={0}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={18} color={subtitleColor} />
            </Pressable>
          )}
        </XStack>
      </YStack>

      {/* Friends List - Scrollable */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <YStack paddingBottom="$6">
          {/* Section Title for friends list */}
          {isOwnProfile && activeTab === 'friends' && (
            <Text
              fontSize={15}
              fontWeight="600"
              color={textColor}
              paddingHorizontal="$4"
              paddingTop="$2"
              paddingBottom="$2"
            >
              Friends
            </Text>
          )}

          {/* Friends Items */}
          {filteredFriends.map(renderFriendItem)}

          {/* Divider - Only for own profile in friends tab */}
          {isOwnProfile && activeTab === 'friends' && (
            <YStack
              height={8}
              backgroundColor={isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'}
              marginVertical="$3"
            />
          )}

          {/* Suggestions Section - Only for own profile in friends tab */}
          {isOwnProfile && activeTab === 'friends' && (
            <YStack>
              <Text
                fontSize={15}
                fontWeight="600"
                color={textColor}
                paddingHorizontal="$4"
                paddingBottom="$2"
              >
                Suggestions For You
              </Text>

              {/* Suggestions Items */}
              {users.slice(10, 15).map(u => (
                <XStack
                  key={u.id}
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  alignItems="center"
                  gap="$3"
                >
                  <YStack style={styles.avatar}>
                    <Image
                      source={{ uri: u.avatarUrl }}
                      style={styles.avatarImage}
                    />
                  </YStack>

                  <YStack flex={1} gap="$0.5">
                    <Text fontSize={14} fontWeight="600" color={textColor}>
                      {u.username}
                    </Text>
                    <Text fontSize={13} color={subtitleColor}>
                      {u.name}
                    </Text>
                    <Text fontSize={12} color={subtitleColor}>
                      {Math.floor(Math.random() * 20)} mutual friends
                    </Text>
                  </YStack>

                  <Button
                    size="$3"
                    backgroundColor={buttonBackground}
                    color={buttonTextColor}
                    borderRadius={8}
                    paddingHorizontal="$4"
                    fontWeight="600"
                    fontSize={14}
                    icon={<UserPlus size={18} color={buttonTextColor} />}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    Follow
                  </Button>
                </XStack>
              ))}
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})
