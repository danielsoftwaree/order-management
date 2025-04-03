import { MantineProvider } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { queryClient } from '@/app/queryClient'
import { Notifications } from '@mantine/notifications'

type Props = {
    children: ReactNode
}

export const RootProviders = ({ children }: Props) => {
    return (
        <MantineProvider>
            <Notifications />
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </MantineProvider>
    )
}
