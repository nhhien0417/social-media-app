import { useEffect, useRef, useCallback } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { usePostStore } from '@/stores/postStore'
import { getUserId } from '@/utils/SecureStore'
import { useCurrentUser } from '@/hooks/useProfile'

export function useSeenTracking() {
  const markPostAsSeen = usePostStore(state => state.seenPost)
  const currentUser = useCurrentUser()
  const userIdRef = useRef<string | null>(null)
  const visibilityTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    if (currentUser?.id) {
      userIdRef.current = currentUser.id
    } else {
      getUserId().then(id => {
        if (id) userIdRef.current = id
      })
    }
  }, [currentUser?.id])

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState.match(/inactive|background/)) {
          usePostStore.getState().flushSeenBatch()
        }
      }
    )

    return () => {
      subscription.remove()
      visibilityTimers.current.forEach(timer => clearTimeout(timer))
      visibilityTimers.current.clear()
      usePostStore.getState().flushSeenBatch()
    }
  }, [])

  const trackSeen = useCallback(
    (postId: string, minVisibleDuration = 2500) => {
      if (!userIdRef.current) return

      const existingTimer = visibilityTimers.current.get(postId)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      const timer = setTimeout(() => {
        if (userIdRef.current) {
          markPostAsSeen(postId, userIdRef.current)
        }
        visibilityTimers.current.delete(postId)
      }, minVisibleDuration)

      visibilityTimers.current.set(postId, timer)
    },
    [markPostAsSeen]
  )

  const cancelTracking = useCallback((postId: string) => {
    const timer = visibilityTimers.current.get(postId)
    if (timer) {
      clearTimeout(timer)
      visibilityTimers.current.delete(postId)
    }
  }, [])

  return { trackSeen, cancelTracking }
}
