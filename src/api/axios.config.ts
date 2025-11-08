import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  removeTokens,
} from './token'
import { ENDPOINTS } from './endpoints'
import { router } from 'expo-router'

export const API_BASE_URL = 'http://localhost:1208/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

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
  await removeTokens()
  router.replace('/(auth)/signin')
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessToken()
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    const status = error?.response?.status

    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes(ENDPOINTS.IDENTITY.TOKEN)) {
        console.warn('🔴 Refresh token expired. Logging out...')
        await handleExpireRefreshToken()
        processQueue(error, null)
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = await getRefreshToken()

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(
          `${API_BASE_URL}/${ENDPOINTS.IDENTITY.TOKEN}`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )

        const accessToken = response.data.data
        await saveTokens(accessToken, refreshToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        processQueue(null, accessToken)

        return api(originalRequest)
      } catch (refreshError) {
        console.warn('🔴 Failed to refresh token. Logging out...')
        await handleExpireRefreshToken()
        processQueue(refreshError, null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    console.warn(
      `❌ API Error [${status}]:`,
      error?.response?.data || error.message
    )

    return Promise.reject(error)
  }
)

export default api
