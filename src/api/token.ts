import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store'

const TOKEN_KEY = 'authToken'

export async function saveToken(token: string) {
  await setItemAsync(TOKEN_KEY, token)
}

export async function getToken() {
  return await getItemAsync(TOKEN_KEY)
}

export async function removeToken() {
  await deleteItemAsync(TOKEN_KEY)
}
