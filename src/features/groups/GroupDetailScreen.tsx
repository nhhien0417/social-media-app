import { useState, useMemo, useEffect } from 'react'
import {
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  RefreshControl,
  Alert,
} from 'react-native'
import { YStack, XStack, Text, useThemeName, Button, Separator } from 'tamagui'
import {
  ChevronLeft,
  Users,
  Lock,
  Globe,
  Settings,
  Share2,
  Bell,
  Search,
  Edit3,
  Trash2,
} from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { formatNumber } from '@/utils/FormatNumber'
import { Group } from '@/types/Group'
import PostCard from '../feed/components/PostCard'
import { groupPosts } from '@/mock/groupPosts'
import { GroupNotificationSheet } from './components/GroupNotificationSheet'
import { GroupSearchModal } from './components/GroupSearchModal'
import { GroupMemberManagementModal } from './components/GroupMemberManagementModal'
import { EditGroupInfoModal } from './components/EditGroupInfoModal'
import { getUserId } from '@/utils/SecureStore'
import { groupMembers } from '@/mock/groupMembers'
import type { GroupMember } from '@/types/Group'
import { Shield, Crown, MoreVertical } from '@tamagui/lucide-icons'

type GroupTab = 'discussion' | 'members' | 'about' | 'yourPosts'

interface GroupDetailScreenProps {
  groupId: string
}

export default function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<GroupTab>('discussion')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notificationSheetVisible, setNotificationSheetVisible] =
    useState(false)
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [memberManagementVisible, setMemberManagementVisible] = useState(false)
  const [editGroupInfoVisible, setEditGroupInfoVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  useEffect(() => {
    const loadUserId = async () => {
      const userId = await getUserId()
      setCurrentUserId(userId)
    }
    loadUserId()
  }, [])

  // Mock group data - in real app, fetch from API
  const group: Group = {
    id: groupId,
    name: 'React Native Developers',
    description:
      'A community for React Native developers to share knowledge and help each other',
    coverUrl: 'https://picsum.photos/seed/group1/800/400',
    avatarUrl:
      'https://ui-avatars.com/api/?name=React+Native&background=61dafb&color=fff&size=200',
    privacy: 'PUBLIC',
    memberCount: 15420,
    status: 'JOINED',
    createdAt: '2024-01-15T10:00:00Z',
    category: 'Technology',
    currentUserRole: 'ADMIN', // Change to 'MEMBER' to test member view
  }

  const isAdmin = group.currentUserRole === 'ADMIN'

  const backgroundColor = isDark ? '#000000' : '#FAFAFA'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const subtitleColor = isDark ? 'rgba(255,255,255,0.6)' : '#6b7280'
  const cardBackground = isDark ? '#1a1a1a' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb'

  const onRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleEditPost = (postId: string) => {
    Alert.alert('Edit Post', `Edit post ${postId}`)
  }

  const handleDeletePost = (postId: string) => {
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

  const userPosts = useMemo(() => {
    if (!currentUserId) return []
    return groupPosts.filter(post => post.authorProfile.id === currentUserId)
  }, [currentUserId])

  const handleMemberPress = (member: GroupMember) => {
    if (isAdmin && member.role !== 'ADMIN') {
      setSelectedMember(member)
      setMemberManagementVisible(true)
    } else {
      router.push(`/profile/${member.id}`)
    }
  }

  const handlePromoteToAdmin = (memberId: string) => {
    Alert.alert('Success', 'Member promoted to admin successfully')
  }

  const handleRemoveMember = (memberId: string) => {
    Alert.alert('Success', 'Member removed from group')
  }

  const handleBlockMember = (memberId: string) => {
    Alert.alert('Success', 'Member blocked successfully')
  }

  const handleSaveGroupInfo = (
    name: string,
    description: string,
    category: string
  ) => {
    Alert.alert('Success', 'Group information updated successfully')
  }

  const handleDeleteGroupPost = (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Post deleted successfully')
          },
        },
      ]
    )
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
                  <YStack
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={isDark ? '#2a2a2a' : '#e4e6eb'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={16} fontWeight="700" color={textColor}>
                      U
                    </Text>
                  </YStack>
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
            {/* Admins Section */}
            {groupMembers.filter(m => m.role === 'ADMIN').length > 0 && (
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

                {groupMembers
                  .filter(m => m.role === 'ADMIN')
                  .map((member, index, arr) => (
                    <Pressable
                      key={member.id}
                      onPress={() => router.push(`/profile/${member.id}`)}
                    >
                      <XStack
                        paddingVertical="$3"
                        alignItems="center"
                        gap="$3"
                        borderBottomWidth={index < arr.length - 1 ? 1 : 0}
                        borderBottomColor={borderColor}
                      >
                        {member.avatarUrl ? (
                          <Image
                            source={{ uri: member.avatarUrl }}
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
                              {member.name.charAt(0)}
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
                              {member.name}
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

              {groupMembers.map((member, index) => (
                <Pressable
                  key={member.id}
                  onPress={() => handleMemberPress(member)}
                >
                  <XStack
                    paddingVertical="$3"
                    alignItems="center"
                    gap="$3"
                    borderBottomWidth={index < groupMembers.length - 1 ? 1 : 0}
                    borderBottomColor={borderColor}
                  >
                    {member.avatarUrl ? (
                      <Image
                        source={{ uri: member.avatarUrl }}
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
                          {member.name.charAt(0)}
                        </Text>
                      </YStack>
                    )}
                    <YStack flex={1}>
                      <XStack alignItems="center" gap="$2">
                        <Text fontSize={15} fontWeight="600" color={textColor}>
                          {member.name}
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
                <Users size={20} color={subtitleColor} />
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600" color={textColor}>
                    General
                  </Text>
                  <Text fontSize={13} color={subtitleColor}>
                    {group.category}
                  </Text>
                </YStack>
              </XStack>

              {isAdmin && (
                <>
                  <Separator borderColor={borderColor} />
                  <Button
                    backgroundColor={
                      isDark ? 'rgba(24,119,242,0.15)' : '#e7f3ff'
                    }
                    color="#1877F2"
                    borderRadius={8}
                    fontWeight="600"
                    fontSize={14}
                    height={40}
                    icon={<Settings size={18} color="#1877F2" />}
                    pressStyle={{ opacity: 0.8, scale: 0.98 }}
                    onPress={() => setEditGroupInfoVisible(true)}
                  >
                    Edit Group Info
                  </Button>
                </>
              )}
            </YStack>
          </YStack>
        )

      case 'yourPosts':
        return (
          <YStack gap="$2" paddingTop="$2">
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                <YStack key={post.id}>
                  <PostCard post={post} />
                  {/* Edit/Delete Actions */}
                  <YStack
                    backgroundColor={cardBackground}
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    borderTopWidth={1}
                    borderTopColor={borderColor}
                    marginTop={-8}
                  >
                    <XStack gap="$2">
                      <Button
                        flex={1}
                        backgroundColor={
                          isDark ? 'rgba(255,255,255,0.1)' : '#f0f2f5'
                        }
                        color={textColor}
                        borderRadius={8}
                        fontWeight="500"
                        fontSize={14}
                        height={40}
                        icon={<Edit3 size={16} color={textColor} />}
                        pressStyle={{ opacity: 0.8, scale: 0.98 }}
                        onPress={() => handleEditPost(post.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        flex={1}
                        backgroundColor={
                          isDark ? 'rgba(255,59,48,0.15)' : '#ffebee'
                        }
                        color="#ef4444"
                        borderRadius={8}
                        fontWeight="500"
                        fontSize={14}
                        height={40}
                        icon={<Trash2 size={16} color="#ef4444" />}
                        pressStyle={{ opacity: 0.8, scale: 0.98 }}
                        onPress={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </Button>
                    </XStack>
                  </YStack>
                </YStack>
              ))
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
        borderBottomColor={borderColor}
        borderBottomWidth={1}
      >
        <XStack alignItems="center" gap="$3" flex={1}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ChevronLeft size={25} color={textColor} />
          </Pressable>
          <Text fontSize={18} fontWeight="700" color={textColor} flex={1}>
            {group.name}
          </Text>
        </XStack>
        <XStack gap="$2">
          <Pressable hitSlop={8} onPress={() => setSearchModalVisible(true)}>
            <Search size={22} color={textColor} />
          </Pressable>
          <Pressable
            hitSlop={8}
            onPress={() => setNotificationSheetVisible(true)}
          >
            <Bell size={22} color={textColor} />
          </Pressable>
          <Pressable hitSlop={8}>
            <Settings size={22} color={textColor} />
          </Pressable>
        </XStack>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cover Photo */}
        {group.coverUrl && (
          <YStack height={220} position="relative">
            <Image source={{ uri: group.coverUrl }} style={styles.coverImage} />
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
            <Button
              flex={1}
              backgroundColor="#1877F2"
              color="#ffffff"
              borderRadius={10}
              fontWeight="600"
              fontSize={15}
              height={44}
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
            >
              Joined
            </Button>
            <Button
              flex={1}
              backgroundColor={isDark ? 'rgba(255,255,255,0.1)' : '#e4e6eb'}
              color={textColor}
              borderRadius={10}
              fontWeight="600"
              fontSize={15}
              height={44}
              icon={<Share2 size={18} color={textColor} />}
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
            >
              Share
            </Button>
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
      <GroupNotificationSheet
        visible={notificationSheetVisible}
        onClose={() => setNotificationSheetVisible(false)}
        isDark={isDark}
        groupName={group.name}
      />

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
          onPromoteToAdmin={handlePromoteToAdmin}
          onRemoveMember={handleRemoveMember}
          onBlockMember={handleBlockMember}
          isDark={isDark}
        />
      )}

      <EditGroupInfoModal
        visible={editGroupInfoVisible}
        onClose={() => setEditGroupInfoVisible(false)}
        group={group}
        onSave={handleSaveGroupInfo}
        isDark={isDark}
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
