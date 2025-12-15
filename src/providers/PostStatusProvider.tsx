import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
} from 'react'

type PostStatus =
  | 'idle'
  | 'posting'
  | 'updating'
  | 'deleting'
  | 'success'
  | 'error'

type PostStatusContextType = {
  status: PostStatus
  mode: 'POST' | 'STORY'
  mediaUrl?: string
  errorMessage?: string
  lastOperation?: 'posting' | 'updating' | 'deleting'
  customSuccessMessage?: { title: string; subtitle: string }
  startPosting: (
    mediaUrl?: string,
    mode?: 'POST' | 'STORY',
    successMessage?: { title: string; subtitle: string }
  ) => void
  finishPosting: () => void
  failPosting: (error: string) => void
  resetPosting: () => void
  startDeleting: (
    mediaUrl?: string,
    mode?: 'POST' | 'STORY',
    successMessage?: { title: string; subtitle: string }
  ) => void
  finishDeleting: () => void
  failDeleting: (error: string) => void
  startUpdating: (
    mediaUrl?: string,
    mode?: 'POST' | 'STORY',
    successMessage?: { title: string; subtitle: string }
  ) => void
  finishUpdating: () => void
  failUpdating: (error: string) => void
}

const PostStatusContext = createContext<PostStatusContextType | undefined>(
  undefined
)

export function PostStatusProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<PostStatus>('idle')
  const [mediaUrl, setMediaUrl] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [lastOperation, setLastOperation] = useState<
    'posting' | 'updating' | 'deleting'
  >()
  const [mode, setMode] = useState<'POST' | 'STORY'>('POST')
  const [customSuccessMessage, setCustomSuccessMessage] = useState<{
    title: string
    subtitle: string
  }>()

  const startPosting = useCallback(
    (
      media?: string,
      newMode: 'POST' | 'STORY' = 'POST',
      successMessage?: { title: string; subtitle: string }
    ) => {
      setStatus('posting')
      setMode(newMode)
      setMediaUrl(media)
      setErrorMessage(undefined)
      setLastOperation('posting')
      setCustomSuccessMessage(successMessage)
    },
    []
  )

  const finishPosting = useCallback(() => {
    setStatus('success')
    setErrorMessage(undefined)

    setTimeout(() => {
      setStatus('idle')
      setMediaUrl(undefined)
      setCustomSuccessMessage(undefined)
    }, 10000)
  }, [])

  const failPosting = useCallback((error: string) => {
    setStatus('error')
    setErrorMessage(error)

    setTimeout(() => {
      setStatus('idle')
      setErrorMessage(undefined)
      setMediaUrl(undefined)
      setCustomSuccessMessage(undefined)
    }, 3000)
  }, [])

  const resetPosting = useCallback(() => {
    setStatus('idle')
    setErrorMessage(undefined)
    setMediaUrl(undefined)
    setCustomSuccessMessage(undefined)
  }, [])

  const startDeleting = useCallback(
    (
      media?: string,
      newMode: 'POST' | 'STORY' = 'POST',
      successMessage?: { title: string; subtitle: string }
    ) => {
      setStatus('deleting')
      setMode(newMode)
      setMediaUrl(media)
      setErrorMessage(undefined)
      setLastOperation('deleting')
      setCustomSuccessMessage(successMessage)
    },
    []
  )

  const finishDeleting = useCallback(() => {
    setStatus('success')
    setErrorMessage(undefined)

    setTimeout(() => {
      setStatus('idle')
      setMediaUrl(undefined)
      setCustomSuccessMessage(undefined)
    }, 3000)
  }, [])

  const failDeleting = useCallback((error: string) => {
    setStatus('error')
    setErrorMessage(error)

    setTimeout(() => {
      setStatus('idle')
      setErrorMessage(undefined)
      setMediaUrl(undefined)
      setCustomSuccessMessage(undefined)
    }, 3000)
  }, [])

  const startUpdating = useCallback(
    (
      media?: string,
      newMode: 'POST' | 'STORY' = 'POST',
      successMessage?: { title: string; subtitle: string }
    ) => {
      setStatus('updating')
      setMode(newMode)
      setMediaUrl(media)
      setErrorMessage(undefined)
      setLastOperation('updating')
      setCustomSuccessMessage(successMessage)
    },
    []
  )

  const finishUpdating = useCallback(() => {
    setStatus('success')
    setErrorMessage(undefined)

    setTimeout(() => {
      setStatus('idle')
      setMediaUrl(undefined)
      setCustomSuccessMessage(undefined)
    }, 3000)
  }, [])

  const failUpdating = useCallback((error: string) => {
    setStatus('error')
    setErrorMessage(error)

    setTimeout(() => {
      setStatus('idle')
      setErrorMessage(undefined)
      setMediaUrl(undefined)
      setCustomSuccessMessage(undefined)
    }, 3000)
  }, [])

  return (
    <PostStatusContext.Provider
      value={{
        status,
        mode,
        mediaUrl,
        errorMessage,
        lastOperation,
        customSuccessMessage,
        startPosting,
        finishPosting,
        failPosting,
        resetPosting,
        startDeleting,
        finishDeleting,
        failDeleting,
        startUpdating,
        finishUpdating,
        failUpdating,
      }}
    >
      {children}
    </PostStatusContext.Provider>
  )
}

export function usePostStatus() {
  const context = useContext(PostStatusContext)
  if (!context) {
    throw new Error('usePostStatus must be used within PostStatusProvider')
  }
  return context
}
