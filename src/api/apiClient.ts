import api from './axios.config'
import { AxiosRequestConfig } from 'axios'

type Params = Record<string, any>
type Data = Record<string, any>

export const ApiClient = {
  get: <T = any>(url: string, params?: Params) =>
    api.get<T>(url, { params }).then(r => r.data),

  post: <T = any>(url: string, data?: Data, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then(r => r.data),

  put: <T = any>(url: string, data?: Data, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config).then(r => r.data),

  delete: <T = any>(url: string) => api.delete<T>(url).then(r => r.data),
}

export default ApiClient
