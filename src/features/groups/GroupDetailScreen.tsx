import { useState, useMemo, useEffect } from 'react'
import {
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  RefreshControl,
  Alert,
} from 'react-native'
import {
  YStack,
  XStack,
  Text,
  useThemeName,
  Button,
  Separator,
  Spinner,
} from 'tamagui'
import {
  ChevronLeft,
  Lock,
  Globe,
  Settings,
  Share2,
  Bell,
  Search,
  Edit3,
  Trash2,
  Shield,
  Crown,
  MoreVertical,
  Calendar,
} from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { formatNumber } from '@/utils/FormatNumber'
import { GroupMember } from '@/types/Group'
import PostCard from '../feed/components/PostCard'
import { useGroupStore } from '@/stores/groupStore'
import { GroupSearchModal } from './components/GroupSearchModal'
import { GroupMemberManagementModal } from './components/GroupMemberManagementModal'
import GroupSettingsSheet from './components/GroupSettingsSheet'
import DeleteGroupModal from './components/DeleteGroupModal'
import { getUserId } from '@/utils/SecureStore'
import Avatar from '@/components/Avatar'
import { useCurrentUser } from '@/hooks/useProfile'

type GroupTab = 'discussion' | 'members' | 'about' | 'yourPosts' | 'requests'

export default function GroupDetailScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>()

  // Store
  const {
    currentGroup,
    members,
    posts,
    groupRequests,
    isLoading,
    fetchGroupDetail,
    fetchGroupMembers,
    fetchGroupPosts,
    fetchGroupRequests,
    joinGroup,
    leaveGroup,
    updateMemberRole,
    removeMember,
    handleJoinRequest,
    clearCurrentGroup,
    deleteGroup,
  } = useGroupStore()
  const currentUser = useCurrentUser()
  const [activeTab, setActiveTab] = useState<GroupTab>('discussion')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [memberManagementVisible, setMemberManagementVisible] = useState(false)
  const [settingsSheetVisible, setSettingsSheetVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  const backgroundColor = isDark ? '#000000' : '#FAFAFA'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const cardBackground = isDark ? '#1a1a1a' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  const userPosts = useMemo(() => {
    if (!currentUserId) return []
    return posts.filter(post => post.authorProfile.id === currentUserId)
  }, [currentUserId, posts])

  useEffect(() => {
    if (groupId) {
      clearCurrentGroup()
      const loadUserId = async () => {
        const userId = await getUserId()
        setCurrentUserId(userId)
      }
      loadUserId()
      fetchData()
    }
  }, [groupId])

  // Fetch requests when tab changes to requests
  useEffect(() => {
    if (
      groupId &&
      activeTab === 'requests' &&
      (currentGroup?.role === 'ADMIN' || currentGroup?.role === 'OWNER')
    ) {
      fetchGroupRequests(groupId)
    }
  }, [activeTab, groupId, currentGroup?.role])

  if (!groupId) {
    return null
  }

  const fetchData = async () => {
    await Promise.all([
      fetchGroupDetail(groupId),
      fetchGroupMembers(groupId),
      fetchGroupPosts(groupId),
    ])
  }

  const group = currentGroup

  if ((isLoading && !group) || (group && group.id !== groupId)) {
    return (
      <YStack
        flex={1}
        backgroundColor={backgroundColor}
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="large" color="#0095F6" />
      </YStack>
    )
  }

  if (!group && !isLoading) {
    return (
      <YStack
        flex={1}
        backgroundColor={backgroundColor}
        alignItems="center"
        justifyContent="center"
      >
        <Text color={textColor}>Group not found</Text>
      </YStack>
    )
  }

  if (!group) return null

  const isAdmin = group?.role === 'ADMIN' || group?.role === 'OWNER'
  const isOwner = group?.role === 'OWNER'
  const isMember = !!group?.role

  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    if (activeTab === 'requests') {
      await fetchGroupRequests(groupId)
    }
    setIsRefreshing(false)
  }

  const handleEditPost = (postId: string) => {
    Alert.alert('Edit Post', `Edit post ${postId}`)
  }

  const handleDeleteGroupPost = (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Handle delete
          Alert.alert('Success', 'Post deleted successfully')
        },
      },
    ])
  }

  const handleMemberPress = (member: GroupMember) => {
    if (isAdmin && member.role !== 'ADMIN') {
      setSelectedMember(member)
      setMemberManagementVisible(true)
    } else {
      router.push(`/profile/${member.user.id}`)
    }
  }

  const handleJoin = async () => {
    try {
      await joinGroup(groupId)
    } catch (error) {
      console.error('Error joining group:', error)
    }
  }

  const handleLeave = async () => {
    try {
      await leaveGroup(groupId)
      router.back()
    } catch (error) {
      console.error('Error leaving group:', error)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      await handleJoinRequest(requestId, true)
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await handleJoinRequest(requestId, false)
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const handlePromoteToAdmin = async (memberId: string) => {
    try {
      await updateMemberRole(groupId, memberId, 'ADMIN')
      setMemberManagementVisible(false)
    } catch (error) {
      console.error('Error promoting member:', error)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(groupId, memberId)
      setMemberManagementVisible(false)
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  const handleDemoteToMember = async (memberId: string) => {
    try {
      await updateMemberRole(groupId, memberId, 'MEMBER')
      setMemberManagementVisible(false)
    } catch (error) {
      console.error('Error demoting member:', error)
    }
  }

  const handleEditGroup = () => {
    router.push({
      pathname: '/group/form',
      params: { mode: 'EDIT', id: groupId },
    })
  }

  const handleDeleteGroup = async () => {
    setIsDeleting(true)
    try {
      await deleteGroup(groupId)
      setDeleteModalVisible(false)
      router.navigate('/profile/groups')
    } catch (error) {
      console.error('Error deleting group:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSettingsPress = () => {
    setSettingsSheetVisible(true)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussion':
        return (
          <YStack gap="$2" paddingTop="$2">
            {/* Create Post Section */}
            <YStack
              backgroundColor={cardBackground}
              borderRadius={12}
              padding="$4"
              marginHorizontal="$3"
              marginTop="$2"
              marginBottom="$1"
            >
              <Pressable
                onPress={() =>
                  router.push(
                    `/create?groupId=${groupId}&groupName=${encodeURIComponent(group.name)}`
                  )
                }
              >
                <XStack gap="$3" alignItems="center">
                  <Avatar uri={currentUser?.avatarUrl || undefined} size={45} />
                  <YStack
                    flex={1}
                    backgroundColor={isDark ? '#2a2a2a' : '#f0f2f5'}
                    borderRadius={24}
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                  >
                    <Text color={subtitleColor} fontSize={15}>
                      What's on your mind?
                    </Text>
                  </YStack>
                </XStack>
              </Pressable>
            </YStack>

            {/* Posts */}
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                onDeleteAsAdmin={handleDeleteGroupPost}
              />
            ))}
          </YStack>
        )

      case 'members':
        return (
          <YStack padding="$3" gap="$3">
            {/* Admins Section */}
            {members.filter(m => m.role === 'ADMIN' || m.role === 'OWNER')
              .length > 0 && (
              <YStack
                backgroundColor={cardBackground}
                borderRadius={12}
                padding="$4"
                borderColor={borderColor}
                borderWidth={1}
                marginBottom="$2"
              >
                <XStack alignItems="center" gap="$2" marginBottom="$3">
                  <Shield size={20} color="#1877F2" />
                  <Text fontSize={16} fontWeight="600" color={textColor}>
                    Admins
                  </Text>
                </XStack>

                {members
                  .filter(m => m.role === 'ADMIN' || m.role === 'OWNER')
                  .map((member, index, arr) => (
                    <Pressable
                      key={member.user.id}
                      onPress={() => router.push(`/profile/${member.user.id}`)}
                    >
                      <XStack
                        paddingVertical="$3"
                        alignItems="center"
                        gap="$3"
                        borderBottomWidth={index < arr.length - 1 ? 1 : 0}
                        borderBottomColor={borderColor}
                      >
                        {member.user.avatarUrl ? (
                          <Image
                            source={{ uri: member.user.avatarUrl }}
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 26,
                            }}
                          />
                        ) : (
                          <YStack
                            width={52}
                            height={52}
                            borderRadius={26}
                            backgroundColor={isDark ? '#2a2a2a' : '#e4e6eb'}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text
                              fontSize={18}
                              fontWeight="700"
                              color={textColor}
                            >
                              {member.user.username.charAt(0)}
                            </Text>
                          </YStack>
                        )}
                        <YStack flex={1}>
                          <XStack alignItems="center" gap="$2">
                            <Text
                              fontSize={15}
                              fontWeight="600"
                              color={textColor}
                            >
                              {member.user.username}
                            </Text>
                            <Crown size={16} color="#f59e0b" />
                          </XStack>
                          <Text
                            fontSize={13}
                            color={subtitleColor}
                            marginTop="$0.5"
                          >
                            Admin
                          </Text>
                        </YStack>
                      </XStack>
                    </Pressable>
                  ))}
              </YStack>
            )}

            {/* All Members */}
            <YStack
              backgroundColor={cardBackground}
              borderRadius={12}
              padding="$4"
              borderColor={borderColor}
              borderWidth={1}
            >
              <Text
                fontSize={16}
                fontWeight="600"
                color={textColor}
                marginBottom="$3"
              >
                Members · {formatNumber(group.memberCount)}
              </Text>

              {members
                .filter(m => m.role === 'MEMBER')
                .map((member, index) => (
                  <Pressable
                    key={member.user.id}
                    onPress={() => handleMemberPress(member)}
                  >
                    <XStack
                      paddingVertical="$3"
                      alignItems="center"
                      gap="$3"
                      borderBottomWidth={
                        index <
                        members.filter(m => m.role === 'MEMBER').length - 1
                          ? 1
                          : 0
                      }
                      borderBottomColor={borderColor}
                    >
                      {member.user.avatarUrl ? (
                        <Image
                          source={{ uri: member.user.avatarUrl }}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 26,
                          }}
                        />
                      ) : (
                        <YStack
                          width={52}
                          height={52}
                          borderRadius={26}
                          backgroundColor={isDark ? '#2a2a2a' : '#e4e6eb'}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            fontSize={18}
                            fontWeight="700"
                            color={textColor}
                          >
                            {member.user.username.charAt(0)}
                          </Text>
                        </YStack>
                      )}
                      <YStack flex={1}>
                        <XStack alignItems="center" gap="$2">
                          <Text
                            fontSize={15}
                            fontWeight="600"
                            color={textColor}
                          >
                            {member.user.username}
                          </Text>
                          {member.role === 'ADMIN' && (
                            <Crown size={14} color="#f59e0b" />
                          )}
                        </XStack>
                        <Text
                          fontSize={13}
                          color={subtitleColor}
                          marginTop="$0.5"
                        >
                          {member.role === 'ADMIN' ? 'Admin' : 'Member'}
                        </Text>
                      </YStack>
                      {isAdmin && member.role !== 'ADMIN' && (
                        <MoreVertical size={20} color={subtitleColor} />
                      )}
                    </XStack>
                  </Pressable>
                ))}
            </YStack>
          </YStack>
        )

      case 'about':
        return (
          <YStack padding="$3" gap="$3">
            <YStack
              backgroundColor={cardBackground}
              borderRadius={12}
              padding="$4"
              borderColor={borderColor}
              borderWidth={1}
              gap="$3"
            >
              <Text fontSize={16} fontWeight="600" color={textColor}>
                About this group
              </Text>
              <Text fontSize={14} color={textColor} lineHeight={20}>
                {group.description}
              </Text>

              <Separator borderColor={borderColor} />

              <XStack alignItems="center" gap="$2">
                {group.privacy === 'PUBLIC' ? (
                  <Globe size={20} color={subtitleColor} />
                ) : (
                  <Lock size={20} color={subtitleColor} />
                )}
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600" color={textColor}>
                    {group.privacy === 'PUBLIC' ? 'Public' : 'Private'}
                  </Text>
                  <Text fontSize={13} color={subtitleColor}>
                    Anyone can see who's in the group and what they post
                  </Text>
                </YStack>
              </XStack>

              <XStack alignItems="center" gap="$2">
                <Calendar size={20} color={subtitleColor} />
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600" color={textColor}>
                    History
                  </Text>
                  <Text fontSize={13} color={subtitleColor}>
                    Created on {new Date(group.createdAt).toLocaleDateString()}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </YStack>
        )

      case 'yourPosts':
        return (
          <YStack gap="$2" paddingTop="$5">
            {/* Create Post Button */}
            <YStack
              backgroundColor={cardBackground}
              marginHorizontal="$3"
              borderRadius={12}
              borderWidth={1}
              borderColor={borderColor}
              overflow="hidden"
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/create',
                    params: { groupId: group.id, groupName: group.name },
                  })
                }
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <XStack
                  padding="$4"
                  alignItems="center"
                  gap="$3"
                  backgroundColor={cardBackground}
                >
                  <YStack
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={
                      isDark ? 'rgba(24,119,242,0.2)' : '#e7f3ff'
                    }
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Edit3 size={20} color="#1877F2" />
                  </YStack>
                  <YStack flex={1}>
                    <Text fontSize={16} fontWeight="600" color={textColor}>
                      Create a post
                    </Text>
                    <Text fontSize={13} color={subtitleColor} marginTop="$0.5">
                      Share something with the group
                    </Text>
                  </YStack>
                </XStack>
              </Pressable>
            </YStack>

            {userPosts.length > 0 ? (
              userPosts.map(post => <PostCard post={post} />)
            ) : (
              <YStack
                backgroundColor={cardBackground}
                borderRadius={12}
                padding="$6"
                marginHorizontal="$3"
                marginTop="$4"
                alignItems="center"
                gap="$3"
              >
                <YStack
                  width={80}
                  height={80}
                  borderRadius={40}
                  backgroundColor={isDark ? '#2a2a2a' : '#f0f2f5'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Edit3 size={32} color={subtitleColor} />
                </YStack>
                <YStack alignItems="center" gap="$1">
                  <Text fontSize={17} fontWeight="600" color={textColor}>
                    No posts yet
                  </Text>
                  <Text
                    fontSize={14}
                    color={subtitleColor}
                    textAlign="center"
                    lineHeight={20}
                  >
                    You haven't posted anything in this group yet
                  </Text>
                </YStack>
              </YStack>
            )}
          </YStack>
        )

      case 'requests':
        return (
          <YStack padding="$3" gap="$3">
            {groupRequests.length > 0 ? (
              <YStack
                backgroundColor={cardBackground}
                borderRadius={12}
                padding="$4"
                borderColor={borderColor}
                borderWidth={1}
              >
                <Text
                  fontSize={16}
                  fontWeight="600"
                  color={textColor}
                  marginBottom="$3"
                >
                  Join Requests · {groupRequests.length}
                </Text>

                {groupRequests.map((request, index) => (
                  <XStack
                    key={request.id}
                    paddingVertical="$3"
                    alignItems="center"
                    gap="$3"
                    borderBottomWidth={index < groupRequests.length - 1 ? 1 : 0}
                    borderBottomColor={borderColor}
                  >
                    {/* User Avatar */}
                    {request.user.avatarUrl ? (
                      <Image
                        source={{ uri: request.user.avatarUrl }}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 26,
                        }}
                      />
                    ) : (
                      <YStack
                        width={52}
                        height={52}
                        borderRadius={26}
                        backgroundColor={isDark ? '#2a2a2a' : '#e4e6eb'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize={18} fontWeight="700" color={textColor}>
                          {request.user.username.charAt(0)}
                        </Text>
                      </YStack>
                    )}

                    {/* User Info */}
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        {request.user.username}
                      </Text>
                      <Text fontSize={13} color={subtitleColor}>
                        Wants to join
                      </Text>
                    </YStack>

                    {/* Actions */}
                    <XStack gap="$2">
                      <Button
                        size="$3"
                        backgroundColor="#10b981"
                        color="#ffffff"
                        borderRadius={8}
                        paddingHorizontal="$3"
                        fontWeight="600"
                        fontSize={13}
                        pressStyle={{ opacity: 0.8, scale: 0.97 }}
                        onPress={() => handleApproveRequest(request.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="$3"
                        backgroundColor={
                          isDark ? 'rgba(255,255,255,0.1)' : '#efefef'
                        }
                        color={textColor}
                        borderRadius={8}
                        paddingHorizontal="$3"
                        fontWeight="600"
                        fontSize={13}
                        pressStyle={{ opacity: 0.8, scale: 0.97 }}
                        onPress={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </Button>
                    </XStack>
                  </XStack>
                ))}
              </YStack>
            ) : (
              <YStack
                backgroundColor={cardBackground}
                borderRadius={12}
                padding="$6"
                alignItems="center"
                gap="$3"
              >
                <Text fontSize={16} fontWeight="600" color={textColor}>
                  No pending requests
                </Text>
                <Text fontSize={14} color={subtitleColor} textAlign="center">
                  There are no pending join requests at the moment
                </Text>
              </YStack>
            )}
          </YStack>
        )
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
        backgroundColor={cardBackground}
      >
        <XStack alignItems="center" gap="$3" flex={1}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={25} color={textColor} />
          </Pressable>
          <Text fontSize={18} fontWeight="700" color={textColor} flex={1}>
            {group.name}
          </Text>
        </XStack>
        <XStack gap="$3">
          <Pressable hitSlop={8} onPress={() => setSearchModalVisible(true)}>
            <Search size={20} color={textColor} />
          </Pressable>
          {isAdmin && (
            <Pressable hitSlop={8} onPress={handleSettingsPress}>
              <Settings size={20} color={textColor} />
            </Pressable>
          )}
        </XStack>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cover Photo */}
        {group.backgroundUrl && (
          <YStack height={220} position="relative">
            <Image
              source={{ uri: group.backgroundUrl }}
              style={styles.coverImage}
            />
            <YStack
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height={80}
              style={{
                background: isDark
                  ? 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
              }}
            />
          </YStack>
        )}

        {/* Group Info */}
        <YStack
          backgroundColor={cardBackground}
          paddingHorizontal="$4"
          paddingTop="$4"
          paddingBottom="$4"
          gap="$3.5"
          borderBottomColor={borderColor}
          borderBottomWidth={1}
        >
          <XStack alignItems="center" gap="$3.5">
            {group.avatarUrl && (
              <Image
                source={{ uri: group.avatarUrl }}
                style={styles.groupAvatar}
              />
            )}
            <YStack flex={1} gap="$1">
              <Text fontSize={18} fontWeight="700" color={textColor}>
                {group.name}
              </Text>
              <XStack alignItems="center" gap="$2">
                {group.privacy === 'PRIVATE' ? (
                  <Lock size={14} color={subtitleColor} />
                ) : (
                  <Globe size={14} color={subtitleColor} />
                )}
                <Text fontSize={13} color={subtitleColor} fontWeight="500">
                  {group.privacy === 'PUBLIC' ? 'Public' : 'Private'} ·{' '}
                  {formatNumber(group.memberCount)} members
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* Action Buttons */}
          <XStack gap="$2.5">
            {isMember ? (
              <Button
                flex={1}
                backgroundColor={isDark ? 'rgba(128,128,128,0.2)' : '#e4e6eb'}
                color={textColor}
                borderRadius={10}
                fontWeight="600"
                fontSize={15}
                height={44}
                pressStyle={{ opacity: 0.9, scale: 0.98 }}
                onPress={handleLeave}
              >
                Joined
              </Button>
            ) : (
              <Button
                flex={1}
                backgroundColor="#1877F2"
                color="#ffffff"
                borderRadius={10}
                fontWeight="600"
                fontSize={15}
                height={44}
                pressStyle={{ opacity: 0.9, scale: 0.98 }}
                onPress={handleJoin}
              >
                Join Group
              </Button>
            )}
          </XStack>
        </YStack>

        {/* Tabs */}
        <XStack
          backgroundColor={cardBackground}
          borderBottomColor={borderColor}
          borderBottomWidth={1}
        >
          {[
            { key: 'discussion', label: 'Discussion' },
            { key: 'yourPosts', label: 'Your Posts' },
            { key: 'members', label: 'Members' },
            { key: 'about', label: 'About' },
            ...(isAdmin ? [{ key: 'requests', label: 'Requests' }] : []),
          ].map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as GroupTab)}
              style={{ flex: 1 }}
            >
              <YStack
                paddingVertical="$3"
                alignItems="center"
                borderBottomWidth={2}
                borderBottomColor={
                  activeTab === tab.key ? '#1877F2' : 'transparent'
                }
              >
                <Text
                  fontSize={15}
                  fontWeight={activeTab === tab.key ? '600' : '400'}
                  color={activeTab === tab.key ? '#1877F2' : subtitleColor}
                >
                  {tab.label}
                </Text>
              </YStack>
            </Pressable>
          ))}
        </XStack>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Modals */}
      <GroupSearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        isDark={isDark}
        groupName={group.name}
      />

      {/* Admin Modals */}
      {selectedMember && (
        <GroupMemberManagementModal
          visible={memberManagementVisible}
          onClose={() => {
            setMemberManagementVisible(false)
            setSelectedMember(null)
          }}
          member={selectedMember}
          isAdmin={isAdmin}
          isOwner={isOwner}
          onPromoteToAdmin={handlePromoteToAdmin}
          onDemoteToMember={handleDemoteToMember}
          onRemoveMember={handleRemoveMember}
          isDark={isDark}
        />
      )}

      <GroupSettingsSheet
        visible={settingsSheetVisible}
        onClose={() => setSettingsSheetVisible(false)}
        onEdit={handleEditGroup}
        onDelete={() => setDeleteModalVisible(true)}
        isOwner={isOwner}
      />

      <DeleteGroupModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteGroup}
        isDeleting={isDeleting}
        groupName={group.name}
      />
    </YStack>
  )
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  groupAvatar: {
    width: 70,
    height: 70,
    borderRadius: 14,
    resizeMode: 'cover',
  },
})
