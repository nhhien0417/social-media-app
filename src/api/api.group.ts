import { ApiClient, ApiClientForm, GenericResponse } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Platform } from 'react-native'
import { dataURItoBlob } from '@/utils/MediaUtils'
import { Post } from '@/types/Post'

// --- Models ---

export type GroupPrivacy = 'PUBLIC' | 'PRIVATE'
export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type JoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type Group = {
  id: string
  name: string
  description?: string
  avatarUrl?: string
  backgroundUrl?: string
  role?: GroupRole
  joinStatus?: JoinRequestStatus
  privacy: GroupPrivacy
  memberCount: number
  createdAt: string
  updatedAt: string
}

// --- Requests ---

export type CreateGroupRequest = {
  name: string
  description?: string
  privacy: GroupPrivacy
}

export type UpdateGroupRequest = {
  groupId: string
  name?: string
  description?: string
  privacy?: GroupPrivacy
}

export type HandleJoinRequestRequest = {
  requestId: string
  approved: boolean
}

export type GetGroupJoinRequestsRequest = {
  groupId: string
  status?: JoinRequestStatus
}

export type UpdateMemberRoleRequest = {
  groupId: string
  memberId: string
  role: GroupRole
}

export type RemoveMemberRequest = {
  groupId: string
  memberId: string
}

// --- Responses ---

export type CreateGroupResponse = GenericResponse<Group>

export type UpdateGroupResponse = GenericResponse<Group>

export type GetGroupDetailResponse = GenericResponse<Group>

export type GetAllGroupsResponse = GenericResponse<Group[]>

export type JoinGroupResponse = GenericResponse<{
  id: string
  groupId: string
  groupName: string
  userId: string
  status: JoinRequestStatus
  requestedAt: string
}>

export type LeaveGroupResponse = GenericResponse<{
  groupId: string
  groupName: string
  userId: string
  leftAt: string
}>

export type GetGroupJoinRequestsResponse = GenericResponse<
  {
    id: string
    groupId: string
    groupName: string
    userId: string
    status: JoinRequestStatus
    requestedAt: string
  }[]
>

export type HandleJoinRequestResponse = GenericResponse<{
  requestId: string
  groupId: string
  groupName: string
  userId: string
  status: JoinRequestStatus
  handledAt: string
}>

export type GetGroupMembersResponse = GenericResponse<
  {
    userId: string
    groupId: string
    role: GroupRole
    joinedAt: string
  }[]
>

export type UpdateMemberRoleResponse = GenericResponse<{
  userId: string
  groupId: string
  role: GroupRole
  joinedAt: string
}>

export type RemoveMemberResponse = GenericResponse<{
  groupId: string
  groupName: string
  userId: string
  removedAt: string
}>

export type GetGroupPostsResponse = GenericResponse<{
  posts: Post[]
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}>

// --- API Functions ---

export const getAllGroupsApi = () => {
  return ApiClient.get<GetAllGroupsResponse>(ENDPOINTS.GROUP.ALL)
}

export const getUserGroupsApi = (userId: string) => {
  return ApiClient.get<GetAllGroupsResponse>(
    `${ENDPOINTS.GROUP.USER_GROUPS}?userId=${userId}`
  )
}

export const getGroupPostsApi = (groupId: string, page = 0, size = 10) => {
  return ApiClient.get<GetGroupPostsResponse>(
    `${ENDPOINTS.GROUP.POSTS(groupId)}?page=${page}&size=${size}`
  )
}

export const createGroupApi = async (
  data: CreateGroupRequest,
  background?: { uri: string; name: string; type: string },
  avatar?: { uri: string; name: string; type: string }
): Promise<CreateGroupResponse> => {
  const formData = new FormData()
  formData.append('group', JSON.stringify(data))

  // Helper to append file
  const appendFile = async (
    key: string,
    file: { uri: string; name: string; type: string }
  ) => {
    if (file.uri.startsWith('data:')) {
      const blob = dataURItoBlob(file.uri)
      formData.append(key, blob, file.name)
    } else if (Platform.OS === 'web') {
      const response = await fetch(file.uri)
      const blob = await response.blob()
      formData.append(key, blob, file.name)
    } else {
      formData.append(key, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any)
    }
  }

  if (background) await appendFile('background', background)
  if (avatar) await appendFile('avatar', avatar)

  return ApiClientForm.upload<CreateGroupResponse>(
    'POST',
    `/${ENDPOINTS.GROUP.CREATE}`,
    formData
  )
}

export const updateGroupApi = async (
  data: UpdateGroupRequest,
  background?: { uri: string; name: string; type: string },
  avatar?: { uri: string; name: string; type: string }
): Promise<UpdateGroupResponse> => {
  const formData = new FormData()
  formData.append('group', JSON.stringify(data))

  // Helper to append file
  const appendFile = async (
    key: string,
    file: { uri: string; name: string; type: string }
  ) => {
    if (file.uri.startsWith('data:')) {
      const blob = dataURItoBlob(file.uri)
      formData.append(key, blob, file.name)
    } else if (Platform.OS === 'web') {
      const response = await fetch(file.uri)
      const blob = await response.blob()
      formData.append(key, blob, file.name)
    } else {
      formData.append(key, {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any)
    }
  }

  if (background) await appendFile('background', background)
  if (avatar) await appendFile('avatar', avatar)

  return ApiClientForm.upload<UpdateGroupResponse>(
    'PUT',
    `/${ENDPOINTS.GROUP.UPDATE}`,
    formData
  )
}

export const deleteGroupApi = (groupId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.GROUP.DELETE(groupId))
}

export const getGroupDetailApi = (groupId: string) => {
  return ApiClient.get<GetGroupDetailResponse>(ENDPOINTS.GROUP.DETAIL(groupId))
}

export const joinGroupApi = (groupId: string) => {
  return ApiClient.post<JoinGroupResponse>(ENDPOINTS.GROUP.JOIN(groupId))
}

export const leaveGroupApi = (groupId: string) => {
  return ApiClient.delete<LeaveGroupResponse>(ENDPOINTS.GROUP.LEAVE(groupId))
}

export const getGroupRequestsApi = (data: GetGroupJoinRequestsRequest) => {
  return ApiClient.get<GetGroupJoinRequestsResponse>(
    ENDPOINTS.GROUP.GET_REQUEST,
    data
  )
}

export const handleGroupRequestApi = (data: HandleJoinRequestRequest) => {
  return ApiClient.put<HandleJoinRequestResponse>(
    ENDPOINTS.GROUP.HANDLE_REQUEST,
    data
  )
}

export const getGroupMembersApi = (groupId: string) => {
  return ApiClient.get<GetGroupMembersResponse>(
    ENDPOINTS.GROUP.MEMBERS(groupId)
  )
}

export const updateMemberRoleApi = (data: UpdateMemberRoleRequest) => {
  return ApiClient.put<UpdateMemberRoleResponse>(ENDPOINTS.GROUP.ROLE, data)
}

export const removeMemberApi = (data: RemoveMemberRequest) => {
  return ApiClient.delete<RemoveMemberResponse>(ENDPOINTS.GROUP.REMOVE, data)
}
