import { memo } from 'react'
import { Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Product } from '@/shared/api/api.types'
import { FormValues } from '../create-order-form'

interface ProductSelectorProps {
    form: ReturnType<typeof useForm<FormValues>>
    products: Product[] | undefined
}

export const ProductSelector = memo(
    ({ form, products }: ProductSelectorProps) => (
        <Select
            label="Product"
            placeholder="Select a product"
            value={form.values.productId}
            data={
                products?.map((product) => ({
                    value: product.id,
                    label: `[${product.price}$] - ${product.name} (${product.stock} left)`,
                    disabled: product.stock === 0,
                })) || []
            }
            searchable
            required
            mb="md"
            {...form.getInputProps('productId')}
        />
    )
)
