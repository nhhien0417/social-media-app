import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from 'react'

type AuthCtx = {
  signedIn: boolean
  signIn: () => Promise<void>
  signOut: () => void
}

const Ctx = createContext<AuthCtx | null>(null)
export const useAuth = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth outside provider')
  return v
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [signedIn, setSignedIn] = useState(false)
  const signIn = async () => setSignedIn(true)
  const signOut = () => setSignedIn(false)
  return (
    <Ctx.Provider value={{ signedIn, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  )
}
