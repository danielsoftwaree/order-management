import { useMutation } from '@tanstack/react-query'
import { authService } from '@/shared/api/api.service'
import { tokenStorage } from '@/shared/tokenStorage'
import { queryClient } from '@/app/queryClient'
import { RegisterData } from '@/shared/api/api.types'
import { LoginData } from '@/shared/api/api.types'

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginData) => authService.login(data),
        onSuccess: (response) => {
            const { data } = response;
            tokenStorage.setToken(data.access_token)
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        }
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterData) => authService.register(data),
        onSuccess: (response) => {
            const { data } = response;
            tokenStorage.setToken(data.access_token)
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        }
    })
}

export const useLogout = () => {
    return {
        logout: () => {
            tokenStorage.removeToken()
            queryClient.clear()
        }
    }
} 