export const getAvatarUrl = (username: string) => {
  const clean = username.trim()
  return `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(clean)}`
}
