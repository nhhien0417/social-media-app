import api from './axios.instance'
import { ENDPOINTS } from './endpoints'

export type RefreshTokenRequest = { refreshToken: string }

export type RefreshTokenResponse = {
  statusCode: number
  error: null | string
  message: string
  data: string
}

export const refreshTokenApi = async (data: RefreshTokenRequest) => {
  const r = await api.post<RefreshTokenResponse>(ENDPOINTS.IDENTITY.TOKEN, data)
  return r.data
}
