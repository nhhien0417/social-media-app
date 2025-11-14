import { useQuery } from '@tanstack/react-query'
import { getUserApi } from '@/api/api.profile'
import { getUserId } from '@/utils/SecureStore'
import { User } from '@/types/User'
import { getAvatarUrl } from '@/utils/Avatar'

const normalizeUser = (user: User | null) => {
  if (!user) return null

  return {
    ...user,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    avatarUrl: user.avatarUrl ?? getAvatarUrl(user.username),
    gender: user.gender ?? '',
    bio: user.bio ?? '',
    dob: user.dob ?? '',
    post: user.posts ?? [],
    friendships: user.friendships ?? [],
  }
}

export const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const userId = await getUserId()
      if (!userId) {
        return null
      }

      try {
        const response = await getUserApi(userId)
        console.log('Success fetching current user:', response.data)

        return normalizeUser(response.data)
      } catch (error) {
        console.error('Error fetching current user:', error)
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
