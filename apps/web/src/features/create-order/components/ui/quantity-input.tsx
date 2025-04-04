import { memo } from 'react'
import { NumberInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FormValues } from '../create-order-form'

interface QuantityInputProps {
    form: ReturnType<typeof useForm<FormValues>>
    maxQuantity: number
}

export const QuantityInput = memo(
    ({ form, maxQuantity }: QuantityInputProps) => (
        <NumberInput
            label="Quantity"
            placeholder="Enter quantity"
            min={1}
            max={maxQuantity}
            required
            mb="xl"
            {...form.getInputProps('quantity')}
        />
    )
)
