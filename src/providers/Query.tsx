import { PropsWithChildren, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,      
      retry: 1,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
})

export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      focusManager.setFocused(state === 'active')
    })
    return () => sub.remove()
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
