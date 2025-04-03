import { useMutation, useQuery } from '@tanstack/react-query'
import { orderService } from '@/shared/api/api.service'
import { CreateOrderData } from '@/shared/api/api.types'
import { queryClient } from '@/app/queryClient'

export const useGetOrders = (userId: string) => {
    return useQuery({
        queryKey: ['orders', userId],
        queryFn: () => orderService.getOrderById(userId),
    })
}

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
        onSuccess: () => {
            // Инвалидируем все запросы, связанные с orders, включая те, что с userId
            queryClient.invalidateQueries({
                queryKey: ['orders'],
                refetchType: 'all'
            })
        },
    })
}
