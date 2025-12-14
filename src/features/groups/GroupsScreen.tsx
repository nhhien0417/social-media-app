import { useState, useMemo, useEffect } from 'react'
import { Pressable } from 'react-native'
import { YStack, XStack, Text, Input, useThemeName } from 'tamagui'
import { ChevronLeft, Search, X, Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { Tab, TabBar, TabValue } from './components/Tabs'
import { GroupsList } from './components/List'

import { useGroupStore } from '@/stores/groupStore'

interface GroupsScreenProps {
  isOwnProfile?: boolean
  userId?: string
}

export default function GroupsScreen({
  isOwnProfile = true,
  userId,
}: GroupsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('joined')
  const [searchQuery, setSearchQuery] = useState('')

  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const [isProcessing, setIsProcessing] = useState(false)

  // Store
  const {
    groups,
    myGroups,
    userRequests,
    isLoading,
    fetchGroups,
    fetchUserGroups,
    fetchUserRequests,
    joinGroup,
    cancelRequest,
  } = useGroupStore()

  useEffect(() => {
    if (isOwnProfile) {
      fetchGroups()
      fetchUserGroups()
      fetchUserRequests()
    } else if (userId) {
      fetchUserGroups(userId)
    }
  }, [userId, isOwnProfile])

  // Handlers
  const handleJoinGroup = async (groupId: string) => {
    setIsProcessing(true)
    try {
      await joinGroup(groupId)
    } catch (error) {
      console.log(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelRequest = async (groupId: string) => {
    setIsProcessing(true)
    try {
      await cancelRequest(groupId)
    } catch (error) {
      console.log(error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'joined':
        return myGroups
      case 'pending':
        return userRequests.map(req => req.group)
      case 'suggestions':
        const joinedIds = new Set(myGroups.map(g => g.id))
        const pendingIds = new Set(userRequests.map(r => r.group.id))
        return groups.filter(g => !joinedIds.has(g.id) && !pendingIds.has(g.id))
      default:
        return []
    }
  }, [activeTab, groups, myGroups, userRequests])

  // Filter data by search query
  const filteredData = useMemo(() => {
    let data = currentData

    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase()
      data = data.filter(group => {
        return (
          group.name.toLowerCase().includes(searchLower) ||
          group.description?.toLowerCase().includes(searchLower)
        )
      })
    }
    return data
  }, [currentData, searchQuery])

  const backgroundColor = isDark ? '#000000' : '#FAFAFA'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const searchBackground = isDark ? 'rgba(255,255,255,0.08)' : '#EFEFEF'

  // Tabs configuration
  const tabs: Tab[] = [
    {
      value: 'joined',
      label: 'Joined',
      count: myGroups.length,
    },
    {
      value: 'pending',
      label: 'Pending',
      count: userRequests.length,
    },
    {
      value: 'suggestions',
      label: 'Discover',
    },
  ]

  // Get card type based on active tab
  const getCardType = (): 'joined' | 'pending' | 'suggestion' => {
    switch (activeTab) {
      case 'joined':
        return 'joined'
      case 'pending':
        return 'pending'
      case 'suggestions':
        return 'suggestion'
      default:
        return 'joined'
    }
  }

  // Get empty message based on active tab
  const getEmptyMessage = () => {
    if (searchQuery) {
      return 'No results found'
    }
    switch (activeTab) {
      case 'joined':
        return 'No groups joined yet'
      case 'pending':
        return 'No pending requests'
      case 'suggestions':
        return 'No suggestions available'
      default:
        return 'No groups found'
    }
  }

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      {/* Header */}
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$3"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" gap="$3">
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
            Groups
          </Text>
        </XStack>
        {isOwnProfile && (
          <Pressable onPress={() => router.push('/group/form')} hitSlop={8}>
            <YStack
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor={isDark ? '#3a3b3c' : '#e4e6eb'}
              alignItems="center"
              justifyContent="center"
            >
              <Plus size={20} color={textColor} />
            </YStack>
          </Pressable>
        )}
      </XStack>

      {/* Tabs */}
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
            placeholder="Search groups..."
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

      {/* Groups List */}
      <GroupsList
        groups={filteredData}
        type={getCardType()}
        isDark={isDark}
        isLoading={false}
        emptyMessage={getEmptyMessage()}
        actionPending={isProcessing || isLoading}
        groupCount={!isOwnProfile ? myGroups.length : undefined}
        onJoinGroup={handleJoinGroup}
        onCancelRequest={handleCancelRequest}
      />
    </YStack>
  )
}
