import { Platform } from 'react-native'

const MOBILE_DEVICE_IP = '192.168.1.6'

const getApiURL = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:1208/api/v1'
  }
  return `http://${MOBILE_DEVICE_IP}:1208/api/v1`
}

const getNotificationWebSocketURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:9101/ws'
    }
    return `http://${MOBILE_DEVICE_IP}:9101/ws`
  }
  return 'https://notifications.your-domain.com/ws'
}

const getChatWebSocketURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'web') {
      return 'http://localhost:9086/chat/ws'
    }
    return `http://${MOBILE_DEVICE_IP}:9086/chat/ws`
  }
  return 'https://chat.your-domain.com/chat/ws'
}

export const API_URL = getApiURL()
export const NOTIFICATION_WEBSOCKET_URL = getNotificationWebSocketURL()
export const CHAT_WEBSOCKET_URL = getChatWebSocketURL()
export const NETWORK_CONFIG = {
  MOBILE_IP: MOBILE_DEVICE_IP,
  PLATFORM: Platform.OS,
  IS_DEV: __DEV__,
  API_URL: API_URL,
  CHAT_WS_URL: CHAT_WEBSOCKET_URL,
  WS_URL: NOTIFICATION_WEBSOCKET_URL,
}
