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

export interface GroupMember {
  userId: string
  groupId: string
  name: string
  avatarUrl?: string
  role: GroupRole
  joinedAt: string
}

export type GroupJoinRequest = {
  id: string
  groupId: string
  groupName: string
  userId: string
  status: JoinRequestStatus
  requestedAt: string
}
