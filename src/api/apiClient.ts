import api from './axios.config'

type Params = Record<string, any>
type Data = Record<string, any>

export const ApiClient = {
  get: <T = any>(url: string, params?: Params) =>
    api.get<T>(url, { params }).then((r) => r.data),

  post: <T = any>(url: string, data?: Data) =>
    api.post<T>(url, data).then((r) => r.data),

  put: <T = any>(url: string, data?: Data) =>
    api.put<T>(url, data).then((r) => r.data),

  delete: <T = any>(url: string) =>
    api.delete<T>(url).then((r) => r.data),
}

export default ApiClient
