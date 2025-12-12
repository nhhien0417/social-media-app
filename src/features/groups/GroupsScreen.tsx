import { useState, useMemo, useEffect } from 'react'
import { Pressable, Alert } from 'react-native'
import { YStack, XStack, Text, Input, useThemeName } from 'tamagui'
import { ChevronLeft, Search, X, Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { Tab, TabBar, TabValue } from './components/Tabs'
import { GroupsList } from './components/List'

import { useGroupStore } from '@/stores/groupStore'

interface GroupsScreenProps {
  isOwnProfile?: boolean
}

export default function GroupsScreen({
  isOwnProfile = true,
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
    isLoading,
    fetchGroups,
    fetchUserGroups,
    joinGroup,
    leaveGroup,
    createGroup,
  } = useGroupStore()

  useEffect(() => {
    fetchGroups()
    fetchUserGroups()
  }, [])

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
      await leaveGroup(groupId)
    } catch (error) {
      console.log(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    setIsProcessing(true)
    try {
      await leaveGroup(groupId)
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
        return myGroups.filter(
          g => g.role === 'MEMBER' || g.role === 'ADMIN' || g.role === 'OWNER'
        )
      case 'pending':
        return groups.filter(g => g.joinStatus === 'PENDING')
      case 'suggestions':
        return groups.filter(
          g =>
            !myGroups.some(mg => mg.id === g.id) && g.joinStatus !== 'PENDING'
        )
      default:
        return []
    }
  }, [activeTab, groups, myGroups])

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
      count: myGroups.filter(
        g => g.role === 'MEMBER' || g.role === 'ADMIN' || g.role === 'OWNER'
      ).length,
    },
    {
      value: 'pending',
      label: 'Pending',
      count: myGroups.filter(g => g.joinStatus === 'PENDING').length,
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
      <TabBar
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
        isDark={isDark}
      />

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
        onJoinGroup={handleJoinGroup}
        onCancelRequest={handleCancelRequest}
        onLeaveGroup={handleLeaveGroup}
      />
    </YStack>
  )
}
