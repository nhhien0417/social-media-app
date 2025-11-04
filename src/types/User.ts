export interface User {
  id: string
  username: string
  name: string
  avatarUrl: string
  isPrivate?: boolean
  followed?: boolean
}
