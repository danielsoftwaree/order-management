import { useMutation, useQuery } from '@tanstack/react-query'
import { productService } from '@/shared/api/api.service'
import { CreateProductData } from '@/shared/api/api.types'

export const useGetProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getProducts(),
    })
}

export const useCreateProduct = () => {
    return useMutation({
        mutationFn: (data: CreateProductData) => productService.createProduct(data),
    })
}
