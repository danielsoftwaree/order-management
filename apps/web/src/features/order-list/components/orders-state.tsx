import { Alert, Center, Loader, Text } from '@mantine/core'

export const OrdersLoader = () => (
    <Center my="xl">
        <Loader size="lg" />
    </Center>
)

export const OrdersError = ({ error }: { error: unknown }) => (
    <Alert title="Error" color="red">
        {(error as Error).message ||
            'Failed to load orders. Please try again later.'}
    </Alert>
)

export const EmptyOrdersList = () => (
    <Text ta="center" my="xl">
        You don't have any orders yet
    </Text>
)
