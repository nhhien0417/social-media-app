export const formatTime = (dateString?: string | Date): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const timeStr = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  // 1. Today
  if (isSameDay(date, now)) {
    return timeStr
  }

  // 2. Yesterday
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, yesterday)) {
    return `Yesterday ${timeStr}`
  }

  // 3. Within this week (less than 7 days ago)
  const diffInMilliseconds = now.getTime() - date.getTime()
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

  if (diffInMilliseconds < ONE_WEEK_MS && diffInMilliseconds > 0) {
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    return `${weekday} ${timeStr}`
  }

  // 4. Older: "Dec 16 18:20"
  const monthDay = date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
  })

  if (date.getFullYear() === now.getFullYear()) {
    return `${monthDay} ${timeStr}`
  }

  return `${monthDay}, ${date.getFullYear()} ${timeStr}`
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}
