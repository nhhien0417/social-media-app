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

export const useUser = (userId?: string) => {
  const users = useProfileStore(state => state.users)
  const fetchUser = useProfileStore(state => state.fetchUser)

  useEffect(() => {
    if (userId) {
      fetchUser(userId)
    }
  }, [userId])

  return userId ? users[userId] || null : null
}

export const useFriends = (userId?: string) => {
  const friends = useProfileStore(state => state.friends)
  const isLoading = useProfileStore(state => state.isLoading)
  const fetchFriends = useProfileStore(state => state.fetchFriends)

  useEffect(() => {
    if (friends.length === 0) {
      fetchFriends(userId)
    }
  }, [userId, friends.length])

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
  const fetchSuggestions = useProfileStore(state => state.fetchSuggestions)

  useEffect(() => {
    if (enabled && suggestions.length === 0) {
      fetchSuggestions()
    }
  }, [enabled, suggestions.length])

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
