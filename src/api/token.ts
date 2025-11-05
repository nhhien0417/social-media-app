import { Platform } from 'react-native'
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

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
  } else {
    await deleteItemAsync(ACCESS_TOKEN_KEY)
    await deleteItemAsync(REFRESH_TOKEN_KEY)
  }
}
