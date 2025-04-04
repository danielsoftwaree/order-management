import { Box, TextInput, NumberInput, Button, Group } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useCreateProduct } from '@/entities/product/product.api'
import { useQueryClient } from '@tanstack/react-query'

interface CreateProductFormProps {
    onSuccess?: () => void
}

interface FormValues {
    name: string
    price: number
    stock: number
}

export function CreateProductForm({ onSuccess }: CreateProductFormProps) {
    const queryClient = useQueryClient()
    const { mutate: createProduct, isPending: isCreatingProduct } =
        useCreateProduct()

    const form = useForm<FormValues>({
        initialValues: {
            name: '',
            price: 0,
            stock: 0,
        },
        validate: {
            name: (value) => (!value ? 'Product name is required' : null),
            price: (value) =>
                value <= 0 ? 'Price must be greater than 0' : null,
            stock: (value) => (value < 0 ? 'Stock cannot be negative' : null),
        },
    })

    const handleSubmit = (values: FormValues) => {
        createProduct(
            {
                name: values.name,
                price: values.price,
                stock: values.stock,
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success!',
                        message: 'Product created successfully',
                        color: 'green',
                    })

                    queryClient.invalidateQueries({ queryKey: ['products'] })
                    form.reset()
                    onSuccess?.()
                },
                onError: (error: any) => {
                    const errorMessage =
                        error.response?.data?.error?.message ||
                        'An error occurred while creating the product'

                    notifications.show({
                        title: 'Error',
                        message: errorMessage,
                        color: 'red',
                    })
                },
            }
        )
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    required
                    mb="md"
                    {...form.getInputProps('name')}
                />

                <NumberInput
                    label="Price"
                    placeholder="Enter price"
                    min={0.01}
                    decimalScale={2}
                    required
                    mb="md"
                    {...form.getInputProps('price')}
                />

                <NumberInput
                    label="Stock"
                    placeholder="Enter stock quantity"
                    min={0}
                    required
                    mb="xl"
                    {...form.getInputProps('stock')}
                />

                <Group justify="flex-end">
                    <Button
                        type="submit"
                        loading={isCreatingProduct}
                        disabled={!form.isValid()}
                    >
                        Create Product
                    </Button>
                </Group>
            </form>
        </Box>
    )
}
