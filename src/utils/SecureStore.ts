import { Platform } from 'react-native'
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_ID_KEY = 'userId'

export async function saveUserId(userId: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(USER_ID_KEY, userId)
  } else {
    await setItemAsync(USER_ID_KEY, userId)
  }
}

export async function getUserId(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(USER_ID_KEY)
  } else {
    return await getItemAsync(USER_ID_KEY)
  }
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } else {
    await setItemAsync(ACCESS_TOKEN_KEY, accessToken)
    await setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export async function getAccessToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } else {
    return await getItemAsync(ACCESS_TOKEN_KEY)
  }
}

export async function getRefreshToken() {
  if (Platform.OS === 'web') {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } else {
    return await getItemAsync(REFRESH_TOKEN_KEY)
  }
}

export async function removeTokens() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
  } else {
    await deleteItemAsync(ACCESS_TOKEN_KEY)
    await deleteItemAsync(REFRESH_TOKEN_KEY)
    await deleteItemAsync(USER_ID_KEY)
  }
}
