import axios from 'axios'

export const api = axios.create({ baseURL: __API__ })

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
