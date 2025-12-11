import api from './axios.config'
import uploadFormData from './xmlHttp.config'

type Params = Record<string, any>
type Data = Record<string, any>

/**
 * Generic response type for API responses
 */
export type GenericResponse<T> = {
  statusCode: number
  error: null | string
  message: string
  data: T
}

/**
 * API Client for JSON-based requests (uses Axios)
 */
export const ApiClient = {
  get: <T = any>(url: string, params?: Params) =>
    api.get<T>(url, { params }).then(r => r.data),

  post: <T = any>(url: string, data?: Data) =>
    api.post<T>(url, data).then(r => r.data),

  put: <T = any>(url: string, data?: Data) =>
    api.put<T>(url, data).then(r => r.data),

  delete: <T = any>(url: string, data?: Data) =>
    api.delete<T>(url, { data }).then(r => r.data),
}

/**
 * API Client for FormData uploads (uses XMLHttpRequest)
 */
export const ApiClientForm = {
  upload: <T>(method: 'POST' | 'PUT', endpoint: string, formData: FormData) =>
    uploadFormData<T>(method, endpoint, formData),
}

export default ApiClient
