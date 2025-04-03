import { memo } from 'react'
import { Button, Group } from '@mantine/core'

interface SubmitButtonProps {
    isLoading: boolean
    isValid: boolean
}

export const SubmitButton = memo(
    ({ isLoading, isValid }: SubmitButtonProps) => (
        <Group justify="center">
            <Button
                type="submit"
                loading={isLoading}
                disabled={!isValid}
                fullWidth
            >
                Create Order
            </Button>
        </Group>
    )
)
