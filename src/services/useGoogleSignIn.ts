import { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { googleLoginApi } from '../api/api.auth'
import { saveTokens } from '../utils/SecureStore'

WebBrowser.maybeCompleteAuthSession()

const WEB_CLIENT_ID =
  '1096846657735-3pv5gvfs5tt2kkhul5hkctrrd7u9r7qi.apps.googleusercontent.com'
const IOS_CLIENT_ID =
  '1096846657735-a6bl82uhi2tf5j5am0g79qlj9t2ctn0q.apps.googleusercontent.com'
const ANDROID_CLIENT_ID =
  '1096846657735-b0v4v6b5dirj2nm6gur932akk0gv1ejm.apps.googleusercontent.com'

export const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  })

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await promptAsync()
      console.log('🔍 Google Sign-In Result:', result.type)

      if (result.type === 'success') {
        const { id_token } = result.params

        if (!id_token) {
          throw new Error('Missing ID token from Google response')
        }

        const response = await googleLoginApi({ idToken: id_token })

        if (response.statusCode === 200 && response.data) {
          const { accessToken, refreshToken, id, email } = response.data

          await saveTokens(accessToken, refreshToken)

          return {
            success: true,
            user: {
              id,
              email,
              accessToken,
              refreshToken,
            },
          }
        } else {
          throw new Error(response.error || 'Sign in failed')
        }
      } else if (result.type === 'cancel') {
        setError('Sign-in canceled')
        return { success: false, error: 'Sign-in canceled' }
      } else {
        throw new Error('Sign-in failed')
      }
    } catch (err: any) {
      const errorMessage =
        err.message || 'An error occurred during Google sign-in'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    request,
    handleGoogleSignIn,
  }
}
