import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({ baseURL: API_URL })

export function attachAuthInterceptor(getAuthToken: () => string | null) {
    api.interceptors.request.use(
        (config) => {
            const token = getAuthToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )
}
