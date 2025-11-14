export const getAvatarUrl = (username?: string) => {
  if (!username) {
    return 'https://ui-avatars.com/api/?name=U&background=random&color=fff'
  }

  const clean = username.trim()
  const parts = clean.split(' ')
  let initials = ''

  if (parts.length === 1) {
    initials = parts[0].substring(0, 2).toUpperCase()
  } else {
    initials = (parts[0][0] + parts[1][0]).toUpperCase()
  }

  const hash = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = hash % 360
  const bg = `hsl(${hue},70%,55%)`
  const bgHex = encodeURIComponent(bg)

  return `https://ui-avatars.com/api/?name=${initials}&background=${bgHex}&color=fff&bold=true`
}
