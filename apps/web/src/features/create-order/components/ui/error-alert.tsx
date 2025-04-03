import { memo } from 'react'
import { Alert } from '@mantine/core'

interface ErrorAlertProps {
    message: string
}

export const ErrorAlert = memo(({ message }: ErrorAlertProps) => (
    <Alert title="Error" color="red" mb="md">
        {message}
    </Alert>
))
