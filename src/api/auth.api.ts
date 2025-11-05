import ApiClient from './apiClient'
import { ENDPOINTS } from './endpoints'

type User = {
  id: string
  email: string
}

export type SignInData = {
  email: string
  password: string
}

export type SignUpData = {
  email: string
  fullName: string
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

export const signInApi = (data: SignInData) => {
  return ApiClient.post<AuthResponse>(ENDPOINTS.IDENTITY.LOGIN, data)
}

export const signUpApi = (data: SignUpData) => {
  return ApiClient.post<{ message: string }>(ENDPOINTS.IDENTITY.REGISTER, data)
}
