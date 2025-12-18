import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  removeTokensAndUserId,
} from '../utils/SecureStore'
import { refreshTokenApi } from './api.token'
import { router } from 'expo-router'
import { ENDPOINTS } from './endpoints'
import { API_URL } from '@/utils/BaseUrl'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string | null) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const handleExpireRefreshToken = async () => {
  await removeTokensAndUserId()
  router.replace('/auth/signin')
}

export const uploadFormData = <T = any>(
  method: 'POST' | 'PUT',
  endpoint: string,
  formData: FormData
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    let retryCount = 0
    const MAX_RETRIES = 1

    const attemptUpload = async (token: string | null, isRetry = false) => {
      const xhr = new XMLHttpRequest()

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (e) {
            resolve(xhr.responseText as any)
          }
        } else if (xhr.status === 401 && !isRetry && retryCount < MAX_RETRIES) {
          retryCount++

          if (endpoint.includes(ENDPOINTS.IDENTITY.TOKEN)) {
            console.warn('🔴 Refresh token expired. Logging out...')
            await handleExpireRefreshToken()
            processQueue(new Error('Refresh token expired') as any, null)
            reject(new Error('Refresh token expired'))
            return
          }

          if (isRefreshing) {
            return new Promise<string | null>((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then(newToken => attemptUpload(newToken, true))
              .catch(err => reject(err))
          }

          isRefreshing = true

          try {
            const refreshToken = await getRefreshToken()

            if (!refreshToken) {
              throw new Error('No refresh token available')
            }

            const refreshRequest = { refreshToken }
            const response = await refreshTokenApi(refreshRequest)
            const accessToken = response.data

            await saveTokens(accessToken, refreshToken)

            processQueue(null, accessToken)

            await attemptUpload(accessToken, true)
          } catch (refreshError) {
            console.warn('🔴 Failed to refresh token. Logging out...')
            await handleExpireRefreshToken()
            processQueue(refreshError as any, null)
            reject(refreshError)
          } finally {
            isRefreshing = false
          }
        } else {
          let errorMessage = 'Upload failed'
          try {
            const errorResponse = JSON.parse(xhr.responseText)
            errorMessage = errorResponse.message || errorMessage
          } catch (e) {
            errorMessage = xhr.responseText || errorMessage
          }
          console.warn(`FormData Upload Error [${xhr.status}]:`, errorMessage)
          reject(new Error(`${errorMessage} (Status: ${xhr.status})`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred during upload'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'))
      })

      const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_URL}${endpoint}`

      xhr.open(method, url, true)

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    }

    try {
      const token = await getAccessToken()
      await attemptUpload(token, false)
    } catch (error) {
      reject(error)
    }
  })
}

export default uploadFormData
