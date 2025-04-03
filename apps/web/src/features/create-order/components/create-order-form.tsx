import { Box, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { notifications } from '@mantine/notifications'
import { useCreateOrderStore } from '../store/create-order-store'
import { useCreateOrder } from '@/entities/order/order.api'
import { useGetProducts } from '@/entities/product/product.api'
import { useQueryClient } from '@tanstack/react-query'
import {
    ProductSelector,
    QuantityInput,
    TotalCost,
    ErrorAlert,
    SubmitButton,
} from './ui'

interface CreateOrderFormProps {
    onSuccess?: () => void
}

export interface FormValues {
    productId: string | null
    quantity: number
}

export function CreateOrderForm({ onSuccess }: CreateOrderFormProps) {
    const { error, setError, selectedProduct, setSelectedProduct, resetState } =
        useCreateOrderStore()
    const queryClient = useQueryClient()

    const {
        data: products,
        isLoading: isLoadingProducts,
        refetch: refetchProducts,
    } = useGetProducts()
    const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()

    const form = useForm<FormValues>({
        initialValues: {
            productId: null,
            quantity: 1,
        },
        validate: {
            productId: (value) => (!value ? 'Select a product' : null),
            quantity: (value) =>
                value < 1 ? 'Quantity must be greater than 0' : null,
        },
    })

    useEffect(() => {
        if (form.values.productId && products) {
            const product = products.find((p) => p.id === form.values.productId)
            setSelectedProduct(product || null)
        } else {
            setSelectedProduct(null)
        }
    }, [form.values.productId, products, setSelectedProduct])

    const handleSubmit = (values: FormValues) => {
        if (!values.productId) {
            form.setFieldError('productId', 'Select a product')
            return
        }
        createOrder(
            {
                productId: values.productId,
                quantity: values.quantity,
            },
            {
                onSuccess: () => {
                    setSelectedProduct(null)
                    notifications.show({
                        title: 'Success!',
                        message: 'Order created successfully',
                        color: 'green',
                    })

                    refetchProducts()

                    queryClient.invalidateQueries({ queryKey: ['currentUser'] })

                    form.reset()
                    resetState()
                    onSuccess?.()
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response?.data?.error.message ||
                        'An error occurred while creating the order'

                    setError(errorMessage)
                    notifications.show({
                        title: 'Error',
                        message: errorMessage,
                        color: 'red',
                    })
                },
            }
        )
    }

    if (isLoadingProducts) {
        return <Loader />
    }

    return (
        <Box>
            {error && <ErrorAlert message={error} />}

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <ProductSelector form={form} products={products} />

                <QuantityInput
                    form={form}
                    maxQuantity={selectedProduct?.stock || 999}
                />

                {selectedProduct && (
                    <TotalCost
                        product={selectedProduct}
                        quantity={form.values.quantity}
                    />
                )}

                <SubmitButton
                    isLoading={isCreatingOrder}
                    isValid={form.isValid()}
                />
            </form>
        </Box>
    )
}
