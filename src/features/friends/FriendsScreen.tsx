import { useState, useMemo, useEffect } from 'react'
import { Pressable } from 'react-native'
import { YStack, XStack, Text, Input, useThemeName } from 'tamagui'
import { ChevronLeft, Search, X } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import {
  getFriendApi,
  getSentApi,
  getPendingApi,
  getAllProfilesApi,
  addFriendApi,
  acceptFriendApi,
  rejectFriendAPi,
} from '@/api/api.profile'
import { getUserId } from '@/utils/SecureStore'
import { Tab, TabBar, TabValue } from './components/Tabs'
import { FriendsList } from './components/List'

interface FriendsScreenProps {
  isOwnProfile?: boolean
  userId?: string
}

export default function FriendsScreen({
  isOwnProfile = true,
  userId: propUserId,
}: FriendsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'
  const queryClient = useQueryClient()

  // Get current user ID
  useEffect(() => {
    const loadUserId = async () => {
      const id = await getUserId()
      setCurrentUserId(id)
    }
    loadUserId()
  }, [])

  const userId = propUserId || currentUserId || ''

  // Fetch friends list
  const { data: friendsData, isLoading: friendsLoading } = useQuery({
    queryKey: ['friends', userId],
    queryFn: () => getFriendApi(userId),
    enabled: !!userId,
  })

  // Fetch sent requests (only for own profile)
  const { data: sentData, isLoading: sentLoading } = useQuery({
    queryKey: ['sent', userId],
    queryFn: () => getSentApi(userId),
    enabled: !!userId && isOwnProfile,
  })

  // Fetch pending requests (only for own profile)
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending', userId],
    queryFn: () => getPendingApi(userId),
    enabled: !!userId && isOwnProfile,
  })

  // Fetch all profiles for suggestions (for all tabs when own profile)
  const { data: allProfilesData, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: () => getAllProfilesApi(),
    enabled: isOwnProfile,
  })

  // Mutations
  const addFriendMutation = useMutation({
    mutationFn: (friendUserId: string) =>
      addFriendApi({ userId, friendUserId }),
    onSuccess: () => {
      console.log('Successfully request friend')
      queryClient.invalidateQueries({ queryKey: ['sent', userId] })
      queryClient.invalidateQueries({ queryKey: ['allProfiles'] })
    },
    onError: (error: any) => {
      console.error('Error adding friend:', error)
    },
  })

  const acceptFriendMutation = useMutation({
    mutationFn: (friendUserId: string) =>
      acceptFriendApi({ userId, friendUserId }),
    onSuccess: () => {
      console.log('Successfully accepting friend')
      queryClient.invalidateQueries({ queryKey: ['friends', userId] })
      queryClient.invalidateQueries({ queryKey: ['pending', userId] })
    },
    onError: (error: any) => {
      console.error('Error accepting friend:', error)
    },
  })

  const rejectFriendMutation = useMutation({
    mutationFn: (friendUserId: string) =>
      rejectFriendAPi({ userId, friendUserId }),
    onSuccess: () => {
      console.log('Successfully rejecting friend')
      queryClient.invalidateQueries({ queryKey: ['pending', userId] })
      queryClient.invalidateQueries({ queryKey: ['sent', userId] })
    },
    onError: (error: any) => {
      console.error('Error rejecting friend:', error)
    },
  })

  // Handlers
  const handleAcceptFriend = (friendUserId: string) => {
    acceptFriendMutation.mutate(friendUserId)
  }

  const handleRejectFriend = (friendUserId: string) => {
    rejectFriendMutation.mutate(friendUserId)
  }

  const handleAddFriend = (friendUserId: string) => {
    addFriendMutation.mutate(friendUserId)
  }

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'friends':
        return friendsData?.data || []
      case 'sent':
        return sentData?.data || []
      case 'requests':
        return pendingData?.data || []
      default:
        return []
    }
  }, [activeTab, friendsData, sentData, pendingData])

  // Get suggestions (exclude friends, sent, and pending)
  const suggestions = useMemo(() => {
    if (!allProfilesData?.data) return []
    const friendIds = new Set(friendsData?.data.map(f => f.id) || [])
    const sentIds = new Set(sentData?.data.map(f => f.id) || [])
    const pendingIds = new Set(pendingData?.data.map(f => f.id) || [])

    return allProfilesData.data
      .filter(
        profile =>
          profile.id !== userId &&
          !friendIds.has(profile.id) &&
          !sentIds.has(profile.id) &&
          !pendingIds.has(profile.id)
      )
      .slice(0, 10)
  }, [allProfilesData, friendsData, sentData, pendingData, userId])

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

  // Loading states
  const isLoading = useMemo(() => {
    switch (activeTab) {
      case 'friends':
        return friendsLoading
      case 'requests':
        return pendingLoading
      case 'sent':
        return sentLoading
      default:
        return false
    }
  }, [activeTab, friendsLoading, pendingLoading, sentLoading])

  const actionPending =
    addFriendMutation.isPending ||
    acceptFriendMutation.isPending ||
    rejectFriendMutation.isPending

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FAFAFA'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const searchBackground = isDark ? 'rgba(255,255,255,0.08)' : '#EFEFEF'
  // Tabs configuration (only for own profile)
  const tabs: Tab[] = [
    {
      value: 'friends',
      label: 'Friends',
      count: friendsData?.data.length || 0,
    },
    {
      value: 'requests',
      label: 'Requests',
      count: pendingData?.data.length || 0,
    },
    {
      value: 'sent',
      label: 'Sent',
      count: sentData?.data.length || 0,
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
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={25} color={textColor} />
        </Pressable>
        <Text fontSize={20} fontWeight="700" color={textColor}>
          Username
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
        suggestions={suggestions}
        suggestionsLoading={suggestionsLoading}
        actionPending={actionPending}
        onAddFriend={handleAddFriend}
        onAcceptFriend={handleAcceptFriend}
        onRejectFriend={handleRejectFriend}
      />
    </YStack>
  )
}
