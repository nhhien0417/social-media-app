import { users } from './users'

export const stories = users.map((u, i) => ({
  id: `s${i + 1}`,
  author: u,
  thumbUrl: u.avatarUrl,
  hasNew: i % 2 === 0,
}))
