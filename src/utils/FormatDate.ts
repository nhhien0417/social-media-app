const SECOND = 1
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

export function formatDate(dateString: string): string {
  const then = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  // 1. Invalid date
  if (isNaN(diffInSeconds)) {
    return ''
  }

  // 2. Less than 1 minute
  if (diffInSeconds < MINUTE) {
    return 'Just now'
  }

  // 3. Less than 1 hour (e.g., "5m")
  if (diffInSeconds < HOUR) {
    const minutes = Math.floor(diffInSeconds / MINUTE)
    return `${minutes}m ago`
  }

  // 4. Less than 1 day (e.g., "3h")
  if (diffInSeconds < DAY) {
    const hours = Math.floor(diffInSeconds / HOUR)
    return `${hours}h ago`
  }

  // 5. Less than 1 week (e.g., "2d")
  if (diffInSeconds < WEEK) {
    const days = Math.floor(diffInSeconds / DAY)
    return `${days}d ago`
  }

  // 6. Handle full dates
  const thenYear = then.getFullYear()
  const nowYear = now.getFullYear()
  const day = then.getDate()

  // Get the month name (e.g., "October")
  const monthName = then.toLocaleString('en-US', { month: 'long' })

  // 7. If same year (e.g., "October 28")
  if (thenYear === nowYear) {
    return `${monthName} ${day}`
  }

  // 8. If previous year (e.g., "October 28, 2024")
  return `${monthName} ${day}, ${thenYear}`
}
