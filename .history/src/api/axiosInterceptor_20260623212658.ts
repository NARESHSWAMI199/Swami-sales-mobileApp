import axios, { AxiosInstance } from 'axios'
import { logInfo, logError } from '../utils/logger'
import { getToken } from '../utils/utils'
import { navigate } from '../navigation/RootNavigation'

// Create an axios instance to be used across the app
const apiClient: AxiosInstance = axios.create({
  // Optional: set a baseURL here if desired
  // baseURL: 'https://api.example.com',
  timeout: 30000,
})

// Request interceptor: attach token and log
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken()
      if (token) {
        if (!config.headers) config.headers = {}
        config.headers.Authorization = `Bearer ${token}`
      }
      logInfo(`REQUEST: ${config.method?.toUpperCase()} ${config.url}`)
    } catch (err: any) {
      logError(`REQUEST INTERCEPTOR ERROR: ${err?.message || err}`)
    }
    return config
  },
  (error) => {
    logError(`REQUEST ERROR: ${error?.message || error}`)
    return Promise.reject(error)
  }
)

// Response interceptor: log responses and handle 401 centrally
apiClient.interceptors.response.use(
  (response) => {
    try {
      logInfo(`RESPONSE: ${response.status} ${response.config.url}`)
    } catch (err: any) {
      logError(`RESPONSE LOG ERROR: ${err?.message || err}`)
    }
    return response
  },
  (error) => {
    try {
      if (error?.response) {
        const { status, config } = error.response
        logError(`RESPONSE ERROR: ${status} ${config?.url}`)
        // Centralized 401 handling: redirect to login
        if (status === 401) {
          logInfo('Unauthorized (401) detected — redirecting to login')
          navigate('login')
        }
      } else {
        logError(`NETWORK/UNKNOWN ERROR: ${error?.message || error}`)
      }
    } catch (err: any) {
      logError(`RESPONSE INTERCEPTOR ERROR: ${err?.message || err}`)
    }
    return Promise.reject(error)
  }
)

export default apiClient
