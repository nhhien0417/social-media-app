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
    friendStatus: user.friendStatus ?? '',
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
        const userData = response.data
        console.log('Success fetching current user:', userData)
        return normalizeUser(userData)
      } catch (error) {
        console.error('Error fetching current user:', error)
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useUserProfile = (userId: string | undefined) => {
  return useQuery<User | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) {
        return null
      }

      try {
        const response = await getUserApi(userId)
        const userData = response.data
        console.log('Success fetching user profile:', userData)
        return normalizeUser(userData)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
