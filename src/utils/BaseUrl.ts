import { Platform } from "react-native"

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:1208/api/v1'
  }
  return 'http://192.168.1.8:1208/api/v1'
}

export const API_BASE_URL = getBaseURL()
