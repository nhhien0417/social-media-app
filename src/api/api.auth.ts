import ApiClient, { GenericResponse } from './apiClient'
import { ENDPOINTS } from './endpoints'

// --- Requests ---

export type SignInData = {
  email: string
  password: string
}

export type SignUpData = {
  email: string
  username: string
  password: string
}

export type ResetPasswordData = {
  email: string
  currentPassword: string
  newPassword: string
}

export type GoogleLoginData = { idToken: string }

// --- Responses ---

export type AuthResponse = GenericResponse<{
  id: string
  email: string
  accessToken: string
  refreshToken: string
}>

// --- API Functions ---

export const signInApi = (data: SignInData) => {
  return ApiClient.post<AuthResponse>(ENDPOINTS.IDENTITY.LOGIN, data)
}

export const signUpApi = (data: SignUpData) => {
  return ApiClient.post<{ message: string }>(ENDPOINTS.IDENTITY.REGISTER, data)
}

export const signOutApi = (email: string) => {
  return ApiClient.post<string>(`${ENDPOINTS.IDENTITY.LOGOUT}?email=${email}`)
}

export const forgotPasswordApi = (email: string) => {
  return ApiClient.get<string>(`${ENDPOINTS.IDENTITY.FORGOT}?email=${email}`)
}

export const resetPasswordApi = (data: ResetPasswordData) => {
  return ApiClient.put<string>(ENDPOINTS.IDENTITY.RESET, data)
}

export const googleLoginApi = (data: GoogleLoginData) => {
  return ApiClient.post<AuthResponse>(ENDPOINTS.IDENTITY.GOOGLE, data)
}
