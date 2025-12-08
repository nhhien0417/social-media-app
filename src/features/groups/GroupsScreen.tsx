import { useState, useMemo } from 'react'
import { Pressable, Alert } from 'react-native'
import { YStack, XStack, Text, Input, useThemeName } from 'tamagui'
import { ChevronLeft, Search, X, Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { Tab, TabBar, TabValue } from './components/Tabs'
import { GroupsList } from './components/List'
import { joinedGroups, pendingGroups, groupSuggestions } from '@/mock/groups'
import { Group } from '@/types/Group'
import { CreateGroupModal } from './components/CreateGroupModal'

interface GroupsScreenProps {
  isOwnProfile?: boolean
}

export default function GroupsScreen({
  isOwnProfile = true,
}: GroupsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('joined')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data - in a real app, these would come from API/hooks
  const [joined, setJoined] = useState<Group[]>(joinedGroups)
  const [pending, setPending] = useState<Group[]>(pendingGroups)
  const [suggestions, setSuggestions] = useState<Group[]>(groupSuggestions)

  // Handlers
  const handleJoinGroup = async (groupId: string) => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      const group = suggestions.find(g => g.id === groupId)
      if (group) {
        // If group is private, add to pending
        if (group.privacy === 'PRIVATE') {
          setPending([...pending, { ...group, status: 'PENDING' }])
        } else {
          // If public, add to joined
          setJoined([...joined, { ...group, status: 'JOINED' }])
        }
        // Remove from suggestions
        setSuggestions(suggestions.filter(g => g.id !== groupId))
      }
      setIsProcessing(false)
    }, 500)
  }

  const handleCancelRequest = async (groupId: string) => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      const group = pending.find(g => g.id === groupId)
      if (group) {
        // Add back to suggestions
        setSuggestions([...suggestions, { ...group, status: 'NONE' }])
        // Remove from pending
        setPending(pending.filter(g => g.id !== groupId))
      }
      setIsProcessing(false)
    }, 500)
  }

  const handleLeaveGroup = async (groupId: string) => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      const group = joined.find(g => g.id === groupId)
      if (group) {
        // Add back to suggestions
        setSuggestions([...suggestions, { ...group, status: 'NONE' }])
        // Remove from joined
        setJoined(joined.filter(g => g.id !== groupId))
      }
      setIsProcessing(false)
    }, 500)
  }

  const handleCreateGroup = (groupData: {
    name: string
    description: string
    privacy: 'PUBLIC' | 'PRIVATE'
    category: string
  }) => {
    // Simulate API call
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: groupData.name,
      description: groupData.description,
      privacy: groupData.privacy,
      category: groupData.category,
      memberCount: 1,
      status: 'JOINED',
      coverImageUrl: undefined,
      avatarUrl: undefined,
    }

    // Add to joined groups
    setJoined([newGroup, ...joined])

    // Show success message
    Alert.alert(
      'Success',
      `Group "${groupData.name}" has been created successfully!`,
      [{ text: 'OK' }]
    )

    // Switch to joined tab
    setActiveTab('joined')
  }

  // Get current data based on active tab
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'joined':
        return joined
      case 'pending':
        return pending
      default:
        return []
    }
  }, [activeTab, joined, pending])

  // Filter data by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return currentData

    const searchLower = searchQuery.toLowerCase()
    return currentData.filter(group => {
      return (
        group.name.toLowerCase().includes(searchLower) ||
        group.description?.toLowerCase().includes(searchLower) ||
        group.category?.toLowerCase().includes(searchLower)
      )
    })
  }, [currentData, searchQuery])

  const backgroundColor = isDark ? '#000000' : '#FAFAFA'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const searchBackground = isDark ? 'rgba(255,255,255,0.08)' : '#EFEFEF'

  // Tabs configuration
  const tabs: Tab[] = [
    {
      value: 'joined',
      label: 'Joined',
      count: joined.length,
    },
    {
      value: 'pending',
      label: 'Pending',
      count: pending.length,
    },
  ]

  // Get card type based on active tab
  const getCardType = (): 'joined' | 'pending' | 'suggestion' => {
    switch (activeTab) {
      case 'joined':
        return 'joined'
      case 'pending':
        return 'pending'
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
        paddingTop="$3"
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
          <Pressable
            onPress={() => setShowCreateModal(true)}
            hitSlop={8}
          >
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
        showSuggestions={!searchQuery}
        suggestions={suggestions}
        actionPending={isProcessing}
        onJoinGroup={handleJoinGroup}
        onCancelRequest={handleCancelRequest}
        onLeaveGroup={handleLeaveGroup}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isDark={isDark}
        onCreateGroup={handleCreateGroup}
      />
    </YStack>
  )
}
