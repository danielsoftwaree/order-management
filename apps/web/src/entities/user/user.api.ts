import { useQuery } from '@tanstack/react-query'
import { userService } from '@/shared/api/api.service'
import { tokenStorage } from '@/shared/tokenStorage'

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => userService.getCurrentUser(),
        enabled: tokenStorage.hasToken()
    })
}
