import { memo } from 'react'
import { Text } from '@mantine/core'
import { Product } from '@/shared/api/api.types'

interface TotalCostProps {
    product: Product
    quantity: number
}

export const TotalCost = memo(({ product, quantity }: TotalCostProps) => (
    <Text size="sm" mb="md">
        Total cost: <strong>{(product.price * quantity).toFixed(2)} $</strong>
    </Text>
))
