export type GroupStatus = 'JOINED' | 'PENDING' | 'NONE'

export type GroupPrivacy = 'PUBLIC' | 'PRIVATE'

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
}
