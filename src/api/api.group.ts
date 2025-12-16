import { ApiClient, ApiClientForm, GenericResponse } from './apiClient'
import { ENDPOINTS } from './endpoints'
import { Platform } from 'react-native'
import { dataURItoBlob } from '@/utils/MediaUtils'
import {
  Group,
  GroupRole,
  GroupPrivacy,
  GroupMember,
  GroupJoinRequest,
} from '@/types/Group'

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

export type UpdateMemberRoleRequest = {
  groupId: string
  memberId: string
  role: GroupRole
}

// --- Responses ---

export type CreateGroupResponse = GenericResponse<Group>

export type UpdateGroupResponse = GenericResponse<Group>

export type GetGroupDetailResponse = GenericResponse<Group>

export type GetAllGroupsResponse = GenericResponse<Group[]>

export type JoinGroupResponse = GenericResponse<GroupJoinRequest>

export type GetUserJoinRequestsResponse = GenericResponse<GroupJoinRequest[]>

export type GetGroupJoinRequestsResponse = GenericResponse<GroupJoinRequest[]>

export type HandleJoinRequestResponse = GenericResponse<GroupJoinRequest>

export type GetGroupMembersResponse = GenericResponse<GroupMember[]>

export type UpdateMemberRoleResponse = GenericResponse<GroupMember>

// --- API Functions ---

export const getAllGroupsApi = () => {
  return ApiClient.get<GetAllGroupsResponse>(ENDPOINTS.GROUP.ALL)
}

export const getUserGroupsApi = (userId: string) => {
  return ApiClient.get<GetAllGroupsResponse>(
    `${ENDPOINTS.GROUP.USER_GROUPS}?userId=${userId}`
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
  return ApiClient.delete<string>(ENDPOINTS.GROUP.LEAVE(groupId))
}

export const getUserRequestsApi = () => {
  return ApiClient.get<GetUserJoinRequestsResponse>(
    ENDPOINTS.GROUP.GET_USER_REQUEST
  )
}

export const getGroupRequestsApi = (groupId: string) => {
  return ApiClient.get<GetGroupJoinRequestsResponse>(
    ENDPOINTS.GROUP.GET_GROUP_REQUEST(groupId)
  )
}

export const handleGroupRequestApi = (data: HandleJoinRequestRequest) => {
  return ApiClient.put<HandleJoinRequestResponse>(
    ENDPOINTS.GROUP.HANDLE_REQUEST,
    data
  )
}

export const cancelRequestApi = (groupId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.GROUP.CANCEL_REQUEST(groupId))
}

export const getGroupMembersApi = (groupId: string) => {
  return ApiClient.get<GetGroupMembersResponse>(
    ENDPOINTS.GROUP.MEMBERS(groupId)
  )
}

export const updateMemberRoleApi = (data: UpdateMemberRoleRequest) => {
  return ApiClient.put<UpdateMemberRoleResponse>(ENDPOINTS.GROUP.ROLE, data)
}

export const removeMemberApi = (groupId: string, memberId: string) => {
  return ApiClient.delete<string>(ENDPOINTS.GROUP.REMOVE(groupId, memberId))
}
