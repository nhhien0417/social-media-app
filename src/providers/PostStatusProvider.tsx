import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
} from 'react'

type PostStatus = 'idle' | 'posting' | 'success' | 'error'

type PostStatusContextType = {
  status: PostStatus
  errorMessage?: string
  mediaUrl?: string
  startPosting: (mediaUrl?: string) => void
  finishPosting: () => void
  failPosting: (error: string) => void
  resetPosting: () => void
}

const PostStatusContext = createContext<PostStatusContextType | undefined>(
  undefined
)

export function PostStatusProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<PostStatus>('idle')
  const [mediaUrl, setMediaUrl] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()

  const startPosting = useCallback((media?: string) => {
    setStatus('posting')
    setMediaUrl(media)
    setErrorMessage(undefined)
  }, [])

  const finishPosting = useCallback(() => {
    setStatus('success')
    setErrorMessage(undefined)

    setTimeout(() => {
      setStatus('idle')
      setMediaUrl(undefined)
    }, 10000)
  }, [])

  const failPosting = useCallback((error: string) => {
    setStatus('error')
    setErrorMessage(error)

    setTimeout(() => {
      setStatus('idle')
      setErrorMessage(undefined)
      setMediaUrl(undefined)
    }, 3000)
  }, [])

  const resetPosting = useCallback(() => {
    setStatus('idle')
    setErrorMessage(undefined)
    setMediaUrl(undefined)
  }, [])

  return (
    <PostStatusContext.Provider
      value={{
        status,
        errorMessage,
        mediaUrl,
        startPosting,
        finishPosting,
        failPosting,
        resetPosting,
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
