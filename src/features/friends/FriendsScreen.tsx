import { useState, useMemo } from 'react'
import { Pressable } from 'react-native'
import { YStack, XStack, Text, Input, useThemeName } from 'tamagui'
import { ChevronLeft, Search, X } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useCurrentUser } from '@/hooks/useProfile'
import {
  useFriends,
  usePending,
  useSent,
  useSuggestions,
  useProfileActions,
} from '@/hooks/useProfile'
import { Tab, TabBar, TabValue } from './components/Tabs'
import { FriendsList } from './components/List'

interface FriendsScreenProps {
  userId?: string
  isOwnProfile?: boolean
}

export default function FriendsScreen({
  userId: propUserId,
  isOwnProfile: propIsOwnProfile,
}: FriendsScreenProps) {
  const params = useLocalSearchParams()
  const paramsIsOwnProfile = params.isOwnProfile === 'true'
  const paramsUserId = params.userId as string | undefined

  const isOwnProfile =
    propIsOwnProfile !== undefined
      ? propIsOwnProfile
      : paramsIsOwnProfile || !paramsUserId
  const targetUserId = propUserId ?? paramsUserId

  const [activeTab, setActiveTab] = useState<TabValue>('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const currentUser = useCurrentUser()
  const userId = isOwnProfile ? currentUser?.id : targetUserId

  // Fetch data - only fetch if we have a valid userId
  const { friends, isLoading: friendsLoading } = useFriends(userId)
  const pending = usePending(isOwnProfile)
  const sent = useSent(isOwnProfile)
  const suggestions = useSuggestions(isOwnProfile)

  // Actions
  const { addFriend, acceptFriend, cancelFriend, rejectFriend, unfriend } =
    useProfileActions()

  const [isProcessing, setIsProcessing] = useState(false)

  // Handlers
  const handleAddFriend = async (friendUserId: string) => {
    setIsProcessing(true)
    await addFriend(friendUserId)
    setIsProcessing(false)
  }

  const handleAcceptFriend = async (friendUserId: string) => {
    setIsProcessing(true)
    await acceptFriend(friendUserId)
    setIsProcessing(false)
  }

  const handleCancelRequest = async (friendUserId: string) => {
    setIsProcessing(true)
    await cancelFriend(friendUserId)
    setIsProcessing(false)
  }

  const handleRejectFriend = async (friendUserId: string) => {
    setIsProcessing(true)
    await rejectFriend(friendUserId)
    setIsProcessing(false)
  }

  const handleUnfriend = async (friendUserId: string) => {
    setIsProcessing(true)
    await unfriend(friendUserId)
    setIsProcessing(false)
  }

  // Get current data based on active tab
  const currentData = useMemo(() => {
    let data: typeof friends = []
    switch (activeTab) {
      case 'friends':
        data = friends || []
        break
      case 'sent':
        data = sent || []
        break
      case 'requests':
        data = pending || []
        break
      default:
        data = []
    }

    if (userId && data.length > 0) {
      return data.filter(user => user.id !== userId)
    }

    return data
  }, [activeTab, friends, sent, pending, userId])

  // Filter data by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return currentData

    const searchLower = searchQuery.toLowerCase()
    return currentData.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      return (
        fullName.includes(searchLower) ||
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      )
    })
  }, [currentData, searchQuery])

  const isLoading = friendsLoading
  const backgroundColor = isDark ? '#000000' : '#FAFAFA'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const searchBackground = isDark ? 'rgba(255,255,255,0.08)' : '#EFEFEF'

  // Tabs configuration (only for own profile)
  const tabs: Tab[] = [
    {
      value: 'friends',
      label: 'Friends',
      count: friends?.length || 0,
    },
    {
      value: 'requests',
      label: 'Requests',
      count: pending?.length || 0,
    },
    {
      value: 'sent',
      label: 'Sent',
      count: sent?.length || 0,
    },
  ]

  // Get card type based on active tab
  const getCardType = (): 'friend' | 'request' | 'sent' | 'suggestion' => {
    switch (activeTab) {
      case 'friends':
        return 'friend'
      case 'requests':
        return 'request'
      case 'sent':
        return 'sent'
      default:
        return 'friend'
    }
  }

  // Get empty message based on active tab
  const getEmptyMessage = () => {
    if (searchQuery) {
      return 'No results found'
    }
    switch (activeTab) {
      case 'friends':
        return 'No friends yet'
      case 'requests':
        return 'No pending requests'
      case 'sent':
        return 'No sent requests'
      default:
        return 'No users found'
    }
  }

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      {/* Header */}
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$3"
        paddingTop="$3"
        alignItems="center"
        gap="$3"
      >
        <Pressable
          onPress={() => {
            if (isOwnProfile) {
              router.replace('/(tabs)/profile')
            } else {
              router.back()
            }
          }}
          hitSlop={8}
        >
          <ChevronLeft size={25} color={textColor} />
        </Pressable>
        <Text fontSize={20} fontWeight="700" color={textColor}>
          Friends
        </Text>
      </XStack>

      {/* Tabs (only show for own profile) */}
      {isOwnProfile && (
        <TabBar
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={setActiveTab}
          isDark={isDark}
        />
      )}

      {/* Search Bar */}
      <YStack paddingHorizontal="$3" paddingVertical="$3">
        <XStack
          backgroundColor={searchBackground}
          borderRadius={10}
          paddingHorizontal="$3"
          paddingVertical="$1"
          alignItems="center"
          gap="$3"
        >
          <Search size={25} color={isDark ? '#8e8e8e' : '#8E8E8E'} />
          <Input
            flex={1}
            placeholder="Search..."
            placeholderTextColor={isDark ? '#8e8e8e' : '#8E8E8E'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            backgroundColor="transparent"
            borderWidth={0}
            fontSize={16}
            color={textColor}
            padding={0}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={20} color={isDark ? '#8e8e8e' : '#8E8E8E'} />
            </Pressable>
          )}
        </XStack>
      </YStack>

      {/* Friends List */}
      <FriendsList
        users={filteredData}
        type={getCardType()}
        isDark={isDark}
        isLoading={isLoading}
        emptyMessage={getEmptyMessage()}
        showSuggestions={isOwnProfile && !searchQuery}
        suggestions={suggestions || []}
        actionPending={isProcessing}
        onAddFriend={handleAddFriend}
        onAcceptFriend={handleAcceptFriend}
        onCancelRequest={handleCancelRequest}
        onRejectFriend={handleRejectFriend}
        onUnfriend={handleUnfriend}
      />
    </YStack>
  )
}
