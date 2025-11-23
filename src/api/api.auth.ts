import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

export type SignInData = {
  email: string
  password: string
}

export type SignUpData = {
  email: string
  username: string
  password: string
}

export type AuthResponse = {
  statusCode: number
  error: null | string
  message: string
  data: {
    id: string
    email: string
    accessToken: string
    refreshToken: string
  }
}

export type RefreshTokenData = {
  refreshToken: string
}

export type RefreshTokenResponse = {
  statusCode: number
  error: null | string
  message: string
  data: string
}

export type GoogleLoginData = {
  idToken: string
}

export type GoogleLoginResponse = AuthResponse

export const signInApi = (data: SignInData) => {
  return ApiClient.post<AuthResponse>(ENDPOINTS.IDENTITY.LOGIN, data)
}

export const signUpApi = (data: SignUpData) => {
  return ApiClient.post<{ message: string }>(ENDPOINTS.IDENTITY.REGISTER, data)
}

export const signOutApi = () => {
  return ApiClient.post(ENDPOINTS.IDENTITY.LOGOUT)
}

export const refreshTokenApi = (data: RefreshTokenData) => {
  return ApiClient.post<RefreshTokenResponse>(ENDPOINTS.IDENTITY.TOKEN, data)
}

export const googleLoginApi = (data: GoogleLoginData) => {
  return ApiClient.post<GoogleLoginResponse>(
    ENDPOINTS.IDENTITY.GOOGLE_LOGIN,
    data
  )
}
