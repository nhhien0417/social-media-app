import { create } from 'zustand'
import { User } from '@/types/User'
import {
  getFriendApi,
  getPendingApi,
  getSentApi,
  getAllProfilesApi,
  addFriendApi,
  acceptFriendApi,
  rejectFriendAPi,
  getUserApi,
  updateProfileApi,
  UpdateProfileRequest,
  UserProfileResponse,
} from '@/api/api.profile'
import { getUserId } from '@/utils/SecureStore'

interface ProfileState {
  // Data
  currentUserId: string | null
  currentUser: User | null
  users: Record<string, User>
  friends: User[]
  pending: User[]
  sent: User[]
  suggestions: User[]

  // Loading states
  isLoading: boolean
  error: string | null

  // Init
  initialize: () => Promise<void>

  // Fetchers
  fetchUser: (userId: string) => Promise<User | null>
  fetchFriends: (userId?: string) => Promise<void>
  fetchPending: () => Promise<void>
  fetchSent: () => Promise<void>
  fetchSuggestions: () => Promise<void>

  // Actions
  addFriend: (friendUserId: string) => Promise<void>
  acceptFriend: (friendUserId: string) => Promise<void>
  cancelFriend: (friendUserId: string) => Promise<void>
  rejectFriend: (friendUserId: string) => Promise<void>
  unfriend: (friendUserId: string) => Promise<void>

  updateProfile: (
    data: UpdateProfileRequest,
    avatar?: { uri: string; name: string; type: string }
  ) => Promise<UserProfileResponse>
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  // Initial state
  currentUserId: null,
  currentUser: null,
  users: {},
  friends: [],
  pending: [],
  sent: [],
  suggestions: [],
  isLoading: false,
  error: null,

  // Initialize
  initialize: async () => {
    try {
      const userId = await getUserId()
      if (!userId) return

      set({ currentUserId: userId })

      const response = await getUserApi(userId)
      const user = response.data

      // Populate authorProfile for each post
      if (user.posts) {
        user.posts = user.posts.map(post => {
          if (!post.authorProfile) {
            return {
              ...post,
              authorProfile: {
                id: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                gender: user.gender,
                dob: user.dob,
                bio: user.bio,
                posts: null,
                groupCount: user.groupCount,
                friendCount: user.friendCount,
                friendStatus: null,
              },
            }
          }
          return post
        })

        user.posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
      console.log('Successful initialize:', response)

      set({
        currentUser: user,
        users: { [user.id]: user },
      })
    } catch (error) {
      console.error('Error initialize:', error)
    }
  },

  updateProfile: async (
    data: UpdateProfileRequest,
    avatar?: { uri: string; name: string; type: string }
  ) => {
    set({ isLoading: true, error: null })
    try {
      const response = await updateProfileApi(data, avatar)
      console.log('Successful update profile:', response)
      const updatedUser = response.data

      set(state => ({
        currentUser: updatedUser,
        users: { ...state.users, [updatedUser.id]: updatedUser },
        isLoading: false,
      }))
      return response
    } catch (error) {
      console.error('Error update profile:', error)
      set({ error: 'Failed to update profile', isLoading: false })
      throw error
    }
  },

  // Users fetcher
  fetchUser: async (userId: string) => {
    const { users } = get()

    const existingUser = users[userId]
    if (existingUser) {
      return existingUser
    }

    try {
      const response = await getUserApi(userId)
      const user = response.data

      // Populate authorProfile for each post
      if (user.posts) {
        user.posts = user.posts.map(post => {
          if (!post.authorProfile) {
            return {
              ...post,
              authorProfile: {
                id: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                email: '',
                gender: user.gender,
                dob: user.dob,
                bio: user.bio,
                posts: null,
                groupCount: user.groupCount,
                friendCount: user.friendCount,
                friendStatus: null,
              },
            }
          }
          return post
        })

        user.posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
      console.log('Successful fetch user:', response)

      set({ users: { ...get().users, [userId]: user } })
      return user
    } catch (error) {
      console.error('Error fetch user:', error)
      return null
    }
  },

  fetchFriends: async (userId?: string) => {
    const targetUserId = userId || get().currentUserId
    if (!targetUserId) return

    set({ isLoading: true, error: null })
    try {
      const response = await getFriendApi(targetUserId)
      const friendsList = response.data || []
      console.log('Successful fetch friends:', response)

      set({ friends: friendsList, isLoading: false })
    } catch (error) {
      console.error('Error fetch friends:', error)
      set({ error: 'Failed to fetch friends', isLoading: false })
    }
  },

  fetchPending: async () => {
    const { currentUserId } = get()
    if (!currentUserId) return

    try {
      const response = await getPendingApi(currentUserId)
      const pendingList = response.data || []
      console.log('Successful fetch pending:', response)

      set({ pending: pendingList })
    } catch (error) {
      console.error('Error fetch pending:', error)
    }
  },

  fetchSent: async () => {
    const { currentUserId } = get()
    if (!currentUserId) return

    try {
      const response = await getSentApi(currentUserId)
      const sentList = response.data || []
      console.log('Successful fetch sent:', response)

      set({ sent: sentList })
    } catch (error) {
      console.error('Error fetch sent:', error)
    }
  },

  fetchSuggestions: async () => {
    const { currentUserId } = get()
    if (!currentUserId) return

    try {
      const response = await getAllProfilesApi()
      const allProfiles = response.data || []
      console.log('Successful fetch suggestions:', response)

      const currentState = get()
      const excludeIds = new Set([
        currentUserId,
        ...currentState.friends.map(u => u.id),
        ...currentState.pending.map(u => u.id),
        ...currentState.sent.map(u => u.id),
      ])

      const suggestionsList = allProfiles
        .filter((u: User) => !excludeIds.has(u.id))
        .slice(0, 10)

      set({ suggestions: suggestionsList })
    } catch (error) {
      console.error('Error fetch suggestions:', error)
    }
  },

  addFriend: async (friendUserId: string) => {
    const { currentUserId, users, suggestions, sent, pending, friends } = get()
    if (!currentUserId) return

    let oldUser = users[friendUserId]
    if (!oldUser) {
      const fetchedUser = await get().fetchUser(friendUserId)
      if (!fetchedUser) return
      oldUser = fetchedUser
    }

    const oldState = { suggestions, sent, pending, friends }
    set({
      users: {
        ...users,
        [friendUserId]: { ...oldUser, friendStatus: 'OUTGOING_PENDING' },
      },
      suggestions: suggestions.filter(u => u.id !== friendUserId),
      pending: pending.filter(u => u.id !== friendUserId),
      friends: friends.filter(u => u.id !== friendUserId),
      sent: [
        ...sent.filter(u => u.id !== friendUserId),
        { ...oldUser, friendStatus: 'OUTGOING_PENDING' },
      ],
    })

    try {
      const response = await addFriendApi({
        userId: currentUserId,
        friendUserId,
      })
      console.log('Successful add friend:', response)

      get().fetchSent()
      get().fetchSuggestions()
    } catch (error) {
      console.error('Error add friend:', error)
      set({ users: { ...get().users, [friendUserId]: oldUser }, ...oldState })
    }
  },

  acceptFriend: async (friendUserId: string) => {
    const { currentUserId, users, pending, friends, sent, suggestions } = get()
    if (!currentUserId) return

    let oldUser = users[friendUserId]
    if (!oldUser) {
      const fetchedUser = await get().fetchUser(friendUserId)
      if (!fetchedUser) return
      oldUser = fetchedUser
    }

    const oldState = { pending, friends, sent, suggestions }
    set({
      users: {
        ...users,
        [friendUserId]: { ...oldUser, friendStatus: 'FRIEND' },
      },
      pending: pending.filter(u => u.id !== friendUserId),
      sent: sent.filter(u => u.id !== friendUserId),
      suggestions: suggestions.filter(u => u.id !== friendUserId),
      friends: [
        ...friends.filter(u => u.id !== friendUserId),
        { ...oldUser, friendStatus: 'FRIEND' },
      ],
    })

    try {
      const response = await acceptFriendApi({
        userId: currentUserId,
        friendUserId,
      })
      console.log('Successful accept friend:', response)

      get().fetchFriends()
      get().fetchPending()
    } catch (error) {
      console.error('Error accept friend:', error)
      set({ users: { ...get().users, [friendUserId]: oldUser }, ...oldState })
    }
  },

  cancelFriend: async (friendUserId: string) => {
    const { currentUserId, users, sent, suggestions, pending, friends } = get()
    if (!currentUserId) return

    let oldUser = users[friendUserId]
    if (!oldUser) {
      const fetchedUser = await get().fetchUser(friendUserId)
      if (!fetchedUser) return
      oldUser = fetchedUser
    }

    const oldState = { sent, suggestions, pending, friends }
    set({
      users: {
        ...users,
        [friendUserId]: { ...oldUser, friendStatus: 'NONE' },
      },
      sent: sent.filter(u => u.id !== friendUserId),
      pending: pending.filter(u => u.id !== friendUserId),
      friends: friends.filter(u => u.id !== friendUserId),
      suggestions: [
        ...suggestions.filter(u => u.id !== friendUserId),
        { ...oldUser, friendStatus: 'NONE' },
      ],
    })

    try {
      const response = await rejectFriendAPi({
        userId: currentUserId,
        friendUserId,
      })
      console.log('Successful cancel friend:', response)

      get().fetchSent()
      get().fetchSuggestions()
    } catch (error) {
      console.error('Error cancel friend:', error)
      set({ users: { ...get().users, [friendUserId]: oldUser }, ...oldState })
    }
  },

  rejectFriend: async (friendUserId: string) => {
    const { currentUserId, users, pending, suggestions, sent, friends } = get()
    if (!currentUserId) return

    let oldUser = users[friendUserId]
    if (!oldUser) {
      const fetchedUser = await get().fetchUser(friendUserId)
      if (!fetchedUser) return
      oldUser = fetchedUser
    }

    const oldState = { pending, suggestions, sent, friends }
    set({
      users: {
        ...users,
        [friendUserId]: { ...oldUser, friendStatus: 'NONE' },
      },
      pending: pending.filter(u => u.id !== friendUserId),
      sent: sent.filter(u => u.id !== friendUserId),
      friends: friends.filter(u => u.id !== friendUserId),
      suggestions: [
        ...suggestions.filter(u => u.id !== friendUserId),
        { ...oldUser, friendStatus: 'NONE' },
      ],
    })

    try {
      const response = await rejectFriendAPi({
        userId: currentUserId,
        friendUserId,
      })
      console.log('Successful reject friend:', response)

      get().fetchPending()
      get().fetchSuggestions()
    } catch (error) {
      console.error('Error reject friend:', error)
      set({ users: { ...get().users, [friendUserId]: oldUser }, ...oldState })
    }
  },

  unfriend: async (friendUserId: string) => {
    const { currentUserId, users, friends, suggestions, pending, sent } = get()
    if (!currentUserId) return

    let oldUser = users[friendUserId]
    if (!oldUser) {
      const fetchedUser = await get().fetchUser(friendUserId)
      if (!fetchedUser) return
      oldUser = fetchedUser
    }

    const oldState = { friends, suggestions, pending, sent }
    set({
      users: {
        ...users,
        [friendUserId]: { ...oldUser, friendStatus: 'NONE' },
      },
      friends: friends.filter(u => u.id !== friendUserId),
      pending: pending.filter(u => u.id !== friendUserId),
      sent: sent.filter(u => u.id !== friendUserId),
      suggestions: [
        ...suggestions.filter(u => u.id !== friendUserId),
        { ...oldUser, friendStatus: 'NONE' },
      ],
    })

    try {
      const response = await rejectFriendAPi({
        userId: currentUserId,
        friendUserId,
      })
      console.log('Successful unfriend:', response)

      get().fetchFriends()
      get().fetchSuggestions()
    } catch (error) {
      console.error('Error unfriend:', error)
      set({ users: { ...get().users, [friendUserId]: oldUser }, ...oldState })
    }
  },
}))
