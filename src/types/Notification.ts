export interface NotificationAction {
  label: string
  type: 'primary' | 'secondary'
}

export interface NotificationItem {
  id: number
  section: string
  avatar: string
  message: string
  time: string
  unread?: boolean
  icon?: string
  actions?: NotificationAction[]
}
