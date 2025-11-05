import axios from 'axios'

export const API_BASE_URL = 'http://localhost:1208/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/*
api.interceptors.request.use(
  async config => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)
*/

api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status
    console.warn(
      `❌ API Error [${status}]:`,
      error?.response?.data || error.message
    )
    return Promise.reject(error)
  }
)

export default api
