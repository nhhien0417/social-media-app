import { create } from 'zustand'
import {
  Group,
  GroupMember,
  GroupRole,
  JoinRequestStatus,
  GroupJoinRequest,
} from '@/types/Group'
import { Post } from '@/types/Post'
import {
  getAllGroupsApi,
  getUserGroupsApi,
  getGroupPostsApi,
  getGroupDetailApi,
  createGroupApi,
  updateGroupApi,
  deleteGroupApi,
  joinGroupApi,
  leaveGroupApi,
  getGroupRequestsApi,
  handleGroupRequestApi,
  getGroupMembersApi,
  updateMemberRoleApi,
  removeMemberApi,
  CreateGroupRequest,
  UpdateGroupRequest,
} from '@/api/api.group'
import { getUserId } from '@/utils/SecureStore'

interface GroupState {
  // State
  groups: Group[]
  myGroups: Group[]
  currentGroup: Group | null
  posts: Post[]
  members: GroupMember[]
  joinRequests: GroupJoinRequest[]
  isLoading: boolean
  isRefreshing: boolean
  error: string | null

  // Actions
  fetchGroups: () => Promise<void>
  fetchUserGroups: (userId?: string) => Promise<void>
  fetchGroupPosts: (groupId: string, page?: number) => Promise<void>

  createGroup: (
    data: CreateGroupRequest,
    background?: { uri: string; name: string; type: string },
    avatar?: { uri: string; name: string; type: string }
  ) => Promise<void>
  updateGroup: (
    data: UpdateGroupRequest,
    background?: { uri: string; name: string; type: string },
    avatar?: { uri: string; name: string; type: string }
  ) => Promise<void>
  deleteGroup: (groupId: string) => Promise<void>
  fetchGroupDetail: (groupId: string) => Promise<void>

  joinGroup: (groupId: string) => Promise<void>
  leaveGroup: (groupId: string) => Promise<void>
  fetchJoinRequests: (groupId: string) => Promise<void>
  handleJoinRequest: (requestId: string, approved: boolean) => Promise<void>

  fetchGroupMembers: (groupId: string) => Promise<void>
  updateMemberRole: (
    groupId: string,
    memberId: string,
    role: GroupRole
  ) => Promise<void>
  removeMember: (groupId: string, memberId: string) => Promise<void>
  clearCurrentGroup: () => void
}

const enrichMemberWithMockData = (member: any): GroupMember => {
  const mockNames = [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'David Wilson',
    'Eva Green',
    'Frank White',
    'Grace Lee',
    'Henry Taylor',
  ]
  const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]

  return {
    ...member,
    name: member.name || `${randomName} (${member.userId.slice(0, 4)})`,
    avatarUrl:
      member.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=random`,
    userId: member.userId,
  }
}

const enrichRequestWithMockData = (request: any): GroupJoinRequest => {
  const mockNames = [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Brown',
    'David Wilson',
    'Eva Green',
    'Frank White',
    'Grace Lee',
    'Henry Taylor',
  ]
  const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]

  return {
    ...request,
    user: {
      name: `${randomName} (${request.userId.slice(0, 4)})`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=random`,
    },
  }
}

export const useGroupStore = create<GroupState>((set, get) => ({
  // Initial State
  groups: [],
  myGroups: [],
  currentGroup: null,
  joinRequests: [],
  members: [],
  posts: [],
  isLoading: false,
  isRefreshing: false,
  error: null,

  // Actions
  fetchGroups: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getAllGroupsApi()
      console.log('Successful fetch groups:', response)
      set({ groups: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching groups:', error)
      set({ error: 'Failed to fetch groups', isLoading: false })
    }
  },

  fetchUserGroups: async (userId?: string) => {
    set({ isLoading: true, error: null })
    try {
      const id = userId || (await getUserId())
      if (!id) return

      const response = await getUserGroupsApi(id)
      console.log('Successful fetch user groups:', response)
      set({ myGroups: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching user groups:', error)
      set({ error: 'Failed to fetch user groups', isLoading: false })
    }
  },

  fetchGroupDetail: async (groupId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getGroupDetailApi(groupId)
      console.log('Successful fetch group detail:', response)
      set({ currentGroup: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching group detail:', error)
      set({ error: 'Failed to fetch group detail', isLoading: false })
    }
  },

  fetchGroupMembers: async (groupId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getGroupMembersApi(groupId)
      console.log('Successful fetch group members:', response)
      const enrichedMembers = response.data.map(enrichMemberWithMockData)
      set({ members: enrichedMembers, isLoading: false })
    } catch (error) {
      console.error('Error fetching group members:', error)
      set({ error: 'Failed to fetch group members', isLoading: false })
    }
  },

  fetchGroupPosts: async (groupId: string, page = 0) => {
    // Only set global loading for first page to avoid flickering
    if (page === 0) set({ isLoading: true, error: null })
    try {
      const response = await getGroupPostsApi(groupId, page)
      console.log('Successful fetch group posts:', response)
      if (page === 0) {
        set({ posts: response.data.posts, isLoading: false })
      } else {
        set(state => ({
          posts: [...state.posts, ...response.data.posts],
          isLoading: false,
        }))
      }
    } catch (error) {
      console.error('Error fetching group posts:', error)
      set({ error: 'Failed to fetch group posts', isLoading: false })
    }
  },

  createGroup: async (data, background, avatar) => {
    set({ isLoading: true, error: null })
    try {
      const response = await createGroupApi(data, background, avatar)
      console.log('Successful create group:', response)
      await Promise.all([get().fetchGroups(), get().fetchUserGroups()])
      set({ isLoading: false })
    } catch (error) {
      console.error('Error creating group:', error)
      set({ error: 'Failed to create group', isLoading: false })
      throw error
    }
  },

  updateGroup: async (data, background, avatar) => {
    set({ isLoading: true, error: null })
    try {
      const response = await updateGroupApi(data, background, avatar)
      console.log('Successful update group:', response)

      const fetchPromises: Promise<void>[] = [
        get().fetchGroups(),
        get().fetchUserGroups(),
      ]

      if (get().currentGroup?.id === data.groupId) {
        fetchPromises.push(get().fetchGroupDetail(data.groupId))
      }

      await Promise.all(fetchPromises)
      set({ isLoading: false })
    } catch (error) {
      console.error('Error updating group:', error)
      set({ error: 'Failed to update group', isLoading: false })
      throw error
    }
  },

  deleteGroup: async (groupId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await deleteGroupApi(groupId)
      console.log('Successful delete group:', response)
      set(state => ({
        groups: state.groups.filter(g => g.id !== groupId),
        myGroups: state.myGroups.filter(g => g.id !== groupId),
        currentGroup:
          state.currentGroup?.id === groupId ? null : state.currentGroup,
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error deleting group:', error)
      set({ error: 'Failed to delete group', isLoading: false })
      throw error
    }
  },

  joinGroup: async (groupId: string) => {
    try {
      const response = await joinGroupApi(groupId)
      console.log('Successful join group:', response)
      await Promise.all([
        get().fetchGroups(),
        get().fetchUserGroups(),
        get().currentGroup?.id === groupId
          ? get().fetchGroupDetail(groupId)
          : Promise.resolve(),
      ])
    } catch (error) {
      console.error('Error joining group:', error)
      throw error
    }
  },

  leaveGroup: async (groupId: string) => {
    try {
      const response = await leaveGroupApi(groupId)
      console.log('Successful leave group:', response)
      await Promise.all([
        get().fetchGroups(),
        get().fetchUserGroups(),
        get().currentGroup?.id === groupId
          ? get().fetchGroupDetail(groupId)
          : Promise.resolve(),
      ])
    } catch (error) {
      console.error('Error leaving group:', error)
      throw error
    }
  },

  updateMemberRole: async (
    groupId: string,
    memberId: string,
    role: GroupRole
  ) => {
    try {
      const response = await updateMemberRoleApi({ groupId, memberId, role })
      console.log('Successful update member role:', response)
      set(state => ({
        members: state.members.map(m =>
          m.userId === memberId ? { ...m, role } : m
        ),
      }))
    } catch (error) {
      console.error('Error updating member role:', error)
      throw error
    }
  },

  removeMember: async (groupId: string, memberId: string) => {
    try {
      const response = await removeMemberApi({ groupId, memberId })
      console.log('Successful remove member:', response)
      set(state => ({
        members: state.members.filter(m => m.userId !== memberId),
      }))
    } catch (error) {
      console.error('Error removing member:', error)
      throw error
    }
  },

  fetchJoinRequests: async (groupId: string) => {
    try {
      const response = await getGroupRequestsApi(groupId)
      console.log('Successful fetch join requests:', response)
      const enrichedRequests = response.data.map(enrichRequestWithMockData)
      set({ joinRequests: enrichedRequests })
    } catch (error) {
      console.error('Error fetching join requests:', error)
    }
  },

  handleJoinRequest: async (requestId: string, approved: boolean) => {
    try {
      const response = await handleGroupRequestApi({ requestId, approved })
      console.log('Successful handle join request:', response)
      set(state => ({
        joinRequests: state.joinRequests.filter(r => r.id !== requestId),
      }))
      if (approved && get().currentGroup?.id) {
        const currentGroupId = get().currentGroup?.id
        if (currentGroupId) {
          get().fetchGroupMembers(currentGroupId)
        }
      }
    } catch (error) {
      console.error('Error handling join request:', error)
      throw error
    }
  },

  clearCurrentGroup: () => {
    set({
      currentGroup: null,
      members: [],
      posts: [],
      joinRequests: [],
      error: null,
    })
  },
}))
