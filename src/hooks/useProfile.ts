import { useEffect } from 'react'
import { useProfileStore } from '@/stores/profileStore'

export const useInitProfile = () => {
  const initialize = useProfileStore(state => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])
}

export const useCurrentUser = () => {
  return useProfileStore(state => state.currentUser)
}

export const useCurrentUserId = () => {
  return useProfileStore(state => state.currentUserId)
}

export const useUser = (userId?: string) => {
  const users = useProfileStore(state => state.users)
  const fetchUser = useProfileStore(state => state.fetchUser)

  useEffect(() => {
    if (userId) {
      fetchUser(userId, true)
    }
  }, [userId])

  return userId ? users[userId] || null : null
}

export const useFriends = (userId?: string) => {
  const currentUser = useProfileStore(state => state.currentUser)
  const users = useProfileStore(state => state.users)
  const isLoading = useProfileStore(state => state.isLoading)
  const fetchFriends = useProfileStore(state => state.fetchFriends)
  const fetchUser = useProfileStore(state => state.fetchUser)

  useEffect(() => {
    if (userId) {
      if (!users[userId]) {
        fetchUser(userId)
      } else {
        fetchFriends(userId)
      }
    } else if (currentUser) {
      fetchFriends(currentUser.id)
    }
  }, [userId, currentUser?.id])

  const friendsStore = useProfileStore(state => state.friends)
  const friends = friendsStore || []

  return { friends, isLoading }
}

export const usePending = (enabled = true) => {
  const pending = useProfileStore(state => state.pending)
  const fetchPending = useProfileStore(state => state.fetchPending)

  useEffect(() => {
    if (enabled && pending.length === 0) {
      fetchPending()
    }
  }, [enabled, pending.length])

  return pending
}

export const useSent = (enabled = true) => {
  const sent = useProfileStore(state => state.sent)
  const fetchSent = useProfileStore(state => state.fetchSent)

  useEffect(() => {
    if (enabled && sent.length === 0) {
      fetchSent()
    }
  }, [enabled, sent.length])

  return sent
}

export const useSuggestions = (enabled = true) => {
  const suggestions = useProfileStore(state => state.suggestions)
  const friends = useProfileStore(state => state.friends)
  const pending = useProfileStore(state => state.pending)
  const sent = useProfileStore(state => state.sent)
  const fetchSuggestions = useProfileStore(state => state.fetchSuggestions)

  const listsLoaded =
    friends.length > 0 || pending.length > 0 || sent.length > 0

  useEffect(() => {
    if (enabled && suggestions.length === 0 && listsLoaded) {
      fetchSuggestions()
    }
  }, [enabled, suggestions.length, listsLoaded, fetchSuggestions])

  return suggestions
}

export const useProfileActions = () => {
  const addFriend = useProfileStore(state => state.addFriend)
  const acceptFriend = useProfileStore(state => state.acceptFriend)
  const cancelFriend = useProfileStore(state => state.cancelFriend)
  const rejectFriend = useProfileStore(state => state.rejectFriend)
  const unfriend = useProfileStore(state => state.unfriend)

  return {
    addFriend,
    acceptFriend,
    cancelFriend,
    rejectFriend,
    unfriend,
  }
}
