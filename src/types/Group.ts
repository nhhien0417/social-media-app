import { User } from './User'

export type GroupPrivacy = 'PUBLIC' | 'PRIVATE'
export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type JoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Group {
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
  user: User
  role: GroupRole
}

export interface GroupJoinRequest {
  id: string
  group: Group
  user: User
  status: JoinRequestStatus
}
