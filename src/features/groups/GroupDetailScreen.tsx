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
  Search,
  Edit3,
  Shield,
  Crown,
  MoreVertical,
  Calendar,
  AlertCircle,
} from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { formatNumber } from '@/utils/FormatNumber'
import { GroupMember, GroupRole } from '@/types/Group'
import PostCard from '../feed/components/PostCard'
import { useGroupStore } from '@/stores/groupStore'
import { usePostStore } from '@/stores/postStore'
import { GroupSearchModal } from './components/GroupSearchModal'
import { GroupMemberManagementModal } from './components/GroupMemberManagementModal'
import GroupSettingsSheet from './components/GroupSettingsSheet'
import DeleteGroupModal from './components/DeleteGroupModal'
import LeaveGroupModal from './components/LeaveGroupModal'
import { getUserId } from '@/utils/SecureStore'
import Avatar from '@/components/Avatar'
import { useCurrentUser } from '@/hooks/useProfile'
import PostingStatus from '../feed/components/PostingStatus'
import DeleteConfirmModal from '../feed/components/DeleteConfirmModal'
import { usePostStatus } from '@/providers/PostStatusProvider'

type GroupTab = 'discussion' | 'members' | 'about' | 'yourPosts'

export default function GroupDetailScreen() {
  const { id: groupId } = useLocalSearchParams<{ id: string }>()

  // Store
  const {
    currentGroup,
    members,
    groupRequests,
    isLoading,
    fetchGroupDetail,
    fetchGroupMembers,
    fetchGroupRequests,
    joinGroup,
    leaveGroup,
    updateMemberRole,
    removeMember,
    handleJoinRequest,
    clearCurrentGroup,
    deleteGroup,
    cancelRequest,
  } = useGroupStore()

  const groupPostsData = usePostStore(state => state.groupPosts[groupId])
  const groupPosts = groupPostsData || []
  const fetchGroupPosts = usePostStore(state => state.fetchGroupPosts)

  const currentUser = useCurrentUser()
  const [activeTab, setActiveTab] = useState<GroupTab>('discussion')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [memberManagementVisible, setMemberManagementVisible] = useState(false)
  const [settingsSheetVisible, setSettingsSheetVisible] = useState(false)
  const [deleteGroupModalVisible, setDeleteGroupModalVisible] = useState(false)
  const [deletePostModalVisible, setDeletePostModalVisible] = useState(false)
  const [leaveModalVisible, setLeaveModalVisible] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isCancelingRequest, setIsCancelingRequest] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

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
    return groupPosts.filter(post => post.authorProfile.id === currentUserId)
  }, [currentUserId, groupPosts])

  useEffect(() => {
    if (groupId) {
      clearCurrentGroup()
      const loadUserId = async () => {
        const userId = await getUserId()
        setCurrentUserId(userId)
      }
      loadUserId()
      fetchGroupDetail(groupId)
    }
  }, [groupId])

  // Fetch tab-specific data when switching tabs
  useEffect(() => {
    if (!groupId || !currentGroup) return

    switch (activeTab) {
      case 'discussion':
      case 'yourPosts':
        fetchGroupPosts(groupId)
        break
      case 'members':
        fetchGroupMembers(groupId)
        if (currentGroup.role === 'ADMIN' || currentGroup.role === 'OWNER') {
          fetchGroupRequests(groupId)
        }
        break
    }
  }, [activeTab, groupId, currentGroup?.role])

  if (!groupId) {
    return null
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
    await fetchGroupDetail(groupId)

    switch (activeTab) {
      case 'discussion':
      case 'yourPosts':
        await fetchGroupPosts(groupId)
        break
      case 'members':
        await fetchGroupMembers(groupId)
        if (isAdmin || isOwner) {
          await fetchGroupRequests(groupId)
        }
        break
    }

    setIsRefreshing(false)
  }

  const handleDeleteGroupPost = (postId: string) => {
    setPostToDelete(postId)
    setDeletePostModalVisible(true)
  }

  const handleMemberPress = (member: GroupMember) => {
    if (isAdmin && member.role !== 'OWNER') {
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
    setIsLeaving(true)
    try {
      await leaveGroup(groupId)
      setLeaveModalVisible(false)
      router.push('/profile/groups')
    } catch (error) {
      console.error('Error leaving group:', error)
    } finally {
      setIsLeaving(false)
    }
  }

  const handleShowLeaveConfirm = () => {
    setLeaveModalVisible(true)
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

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(groupId, memberId)
      setMemberManagementVisible(false)
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: GroupRole) => {
    try {
      await updateMemberRole(groupId, memberId, newRole)
      setMemberManagementVisible(false)
      await Promise.all([fetchGroupMembers(groupId), fetchGroupDetail(groupId)])
    } catch (error) {
      console.error('Error updating member role:', error)
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
      setDeleteGroupModalVisible(false)
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

  const handleCancelRequest = async () => {
    setIsCancelingRequest(true)
    try {
      await cancelRequest(groupId)
    } catch (error) {
      console.error('Error canceling request:', error)
    } finally {
      setIsCancelingRequest(false)
    }
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
            <PostingStatus />
            {groupPosts.map(post => (
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
            {/* Pending Requests Section  */}
            {(isAdmin || isOwner) && groupRequests.length > 0 && (
              <YStack
                backgroundColor={cardBackground}
                borderRadius={12}
                padding="$4"
                borderColor={borderColor}
                borderWidth={1}
              >
                <XStack alignItems="center" gap="$2" marginBottom="$3">
                  <AlertCircle size={20} color="#ff9500" />
                  <Text fontSize={16} fontWeight="600" color={textColor}>
                    Pending Requests · {groupRequests.length}
                  </Text>
                </XStack>

                {groupRequests.map((request, index) => (
                  <XStack
                    key={request.id}
                    paddingVertical="$3"
                    alignItems="center"
                    gap="$3"
                    borderBottomWidth={index < groupRequests.length - 1 ? 1 : 0}
                    borderBottomColor={borderColor}
                  >
                    <Avatar
                      uri={request.user.avatarUrl || undefined}
                      size={52}
                    />

                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="600" color={textColor}>
                        {request.user.username}
                      </Text>
                      <Text fontSize={13} color={subtitleColor}>
                        Wants to join
                      </Text>
                    </YStack>

                    <XStack gap="$2">
                      <Button
                        size="$3"
                        backgroundColor="#1877F2"
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
            )}

            {/* Members Section - All members sorted by role */}
            <YStack
              backgroundColor={cardBackground}
              borderRadius={12}
              padding="$4"
              borderColor={borderColor}
              borderWidth={1}
            >
              <XStack alignItems="center" gap="$2" marginBottom="$3">
                <Shield size={20} color="#1877F2" />
                <Text fontSize={16} fontWeight="600" color={textColor}>
                  Members · {members.length}
                </Text>
              </XStack>

              {members
                .sort((a, b) => {
                  // Sort by role: OWNER > ADMIN > MEMBER
                  const roleOrder = { OWNER: 0, ADMIN: 1, MEMBER: 2 }
                  return roleOrder[a.role] - roleOrder[b.role]
                })
                .map((member, index) => (
                  <XStack
                    key={member.user.id}
                    paddingVertical="$3"
                    alignItems="center"
                    gap="$3"
                    borderBottomWidth={index < members.length - 1 ? 1 : 0}
                    borderBottomColor={borderColor}
                  >
                    <Pressable
                      onPress={() => router.push(`/profile/${member.user.id}`)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        flex: 1,
                      }}
                    >
                      <Avatar
                        uri={member.user.avatarUrl || undefined}
                        size={52}
                      />

                      <YStack flex={1}>
                        <XStack alignItems="center" gap="$2">
                          <Text
                            fontSize={15}
                            fontWeight="600"
                            color={textColor}
                          >
                            {member.user.username}
                          </Text>
                        </XStack>
                        <XStack alignItems="center" gap={4} marginTop={2}>
                          {member.role === 'OWNER' ? (
                            <>
                              <Crown size={14} color="#f59e0b" />
                              <Text
                                fontSize={13}
                                color="#f59e0b"
                                fontWeight="500"
                              >
                                Owner
                              </Text>
                            </>
                          ) : member.role === 'ADMIN' ? (
                            <>
                              <Shield size={14} color="#10b981" />
                              <Text
                                fontSize={13}
                                color="#10b981"
                                fontWeight="500"
                              >
                                Admin
                              </Text>
                            </>
                          ) : (
                            <Text fontSize={13} color={subtitleColor}>
                              Member
                            </Text>
                          )}
                        </XStack>
                      </YStack>
                    </Pressable>

                    {/* Management Icon */}
                    {member.role !== 'OWNER' &&
                      ((isOwner &&
                        (member.role === 'ADMIN' ||
                          member.role === 'MEMBER')) ||
                        (isAdmin && !isOwner && member.role === 'MEMBER')) &&
                      member.user.id !== currentUserId && (
                        <Pressable
                          onPress={() => handleMemberPress(member)}
                          hitSlop={8}
                        >
                          <MoreVertical size={20} color={subtitleColor} />
                        </Pressable>
                      )}
                  </XStack>
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
              userPosts.map(post => <PostCard key={post.id} post={post} />)
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
              resizeMode="cover"
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
                resizeMode="cover"
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
          {!isOwner && (
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
                  onPress={handleShowLeaveConfirm}
                >
                  Joined
                </Button>
              ) : currentGroup.joinStatus === 'PENDING' ? (
                <Button
                  flex={1}
                  backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#efefef'}
                  color={textColor}
                  borderRadius={10}
                  fontWeight="600"
                  fontSize={15}
                  height={44}
                  opacity={isCancelingRequest ? 0.6 : 1}
                  pressStyle={{ opacity: 0.9, scale: 0.98 }}
                  onPress={handleCancelRequest}
                  disabled={isCancelingRequest}
                >
                  {isCancelingRequest ? 'Canceling...' : 'Cancel Request'}
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
          )}
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
          currentUserRole={group.role || 'MEMBER'}
          currentUserId={currentUserId || ''}
          isDark={isDark}
          onUpdateRole={handleUpdateRole}
          onRemoveMember={handleRemoveMember}
        />
      )}

      <GroupSettingsSheet
        visible={settingsSheetVisible}
        onClose={() => setSettingsSheetVisible(false)}
        onEdit={handleEditGroup}
        onDelete={() => setDeleteGroupModalVisible(true)}
        isOwner={isOwner}
      />

      <DeleteGroupModal
        visible={deleteGroupModalVisible}
        onClose={() => setDeleteGroupModalVisible(false)}
        onConfirm={handleDeleteGroup}
        isDeleting={isDeleting}
        groupName={group.name}
      />

      {postToDelete && (
        <DeleteConfirmModal
          visible={deletePostModalVisible}
          onClose={() => {
            setDeletePostModalVisible(false)
            setPostToDelete(null)
          }}
          postId={postToDelete}
          mode="POST"
        />
      )}

      <LeaveGroupModal
        visible={leaveModalVisible}
        onClose={() => setLeaveModalVisible(false)}
        onConfirm={handleLeave}
        isLeaving={isLeaving}
        groupName={group.name}
      />
    </YStack>
  )
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: '100%',
  },
  groupAvatar: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
})
