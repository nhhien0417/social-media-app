export type GroupStatus = 'JOINED' | 'PENDING' | 'NONE'

export type GroupPrivacy = 'PUBLIC' | 'PRIVATE'

export type GroupRole = 'ADMIN' | 'MEMBER'

export interface GroupMember {
  id: string
  name: string
  avatarUrl?: string
  role: GroupRole
  joinedAt: string
}

export interface Group {
  id: string
  name: string
  description: string
  coverUrl: string | null
  avatarUrl: string | null
  privacy: GroupPrivacy
  memberCount: number
  status: GroupStatus
  createdAt: string
  category?: string
  currentUserRole?: GroupRole
}
