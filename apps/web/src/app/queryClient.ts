import { ApiErrorData } from '@/shared/api/api.types'
import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
        },
    },
})

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: AxiosError<ApiErrorData>
    }
}
