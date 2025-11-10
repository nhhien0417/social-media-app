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

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  })

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Bước 1: Prompt user đăng nhập Google
      const result = await promptAsync()

      if (result.type === 'success') {
        const { id_token } = result.params

        if (!id_token) {
          throw new Error('Không nhận được ID token từ Google')
        }

        // Bước 2: Gửi ID token lên backend
        const response = await googleLoginApi({ idToken: id_token })

        if (response.statusCode === 200 && response.data) {
          const { accessToken, refreshToken, id, email } = response.data

          // Bước 3: Lưu access token và refresh token
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
          throw new Error(response.error || 'Đăng nhập thất bại')
        }
      } else if (result.type === 'cancel') {
        setError('Đăng nhập bị hủy')
        return { success: false, error: 'Đăng nhập bị hủy' }
      } else {
        throw new Error('Đăng nhập thất bại')
      }
    } catch (err: any) {
      const errorMessage =
        err.message || 'Có lỗi xảy ra khi đăng nhập với Google'
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
