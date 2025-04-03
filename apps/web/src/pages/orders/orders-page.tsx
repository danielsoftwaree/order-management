import { useState } from 'react'
import {
    Container,
    Tabs,
    Title,
    Flex,
    Paper,
    Button,
    Text,
    Badge,
    Group,
    Avatar,
    Space,
} from '@mantine/core'
import { OrdersList } from '@/features/order-list'
import { CreateOrderForm } from '@/features/create-order'
import { useLogout } from '@/features/auth'
import { useNavigate } from 'react-router-dom'
import { useGetCurrentUser } from '@/entities/user/user.api'

export function OrdersPage() {
    const [activeTab, setActiveTab] = useState<string | null>('orders')
    const { logout } = useLogout()
    const navigate = useNavigate()
    const { data: user, isLoading } = useGetCurrentUser()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <Container size="lg" py="xl">
            <Flex
                direction={{ base: 'column', md: 'row' }}
                justify={{ base: 'center', md: 'space-between' }}
                align="center"
                gap="md"
            >
                <Title order={1}>Order Management</Title>
                <Group gap="lg">
                    <Avatar color="blue" radius="xl">
                        {user?.name?.charAt(0) || '?'}
                    </Avatar>
                    <Flex direction="column" align="flex-start">
                        <Text fw={500} size="lg">
                            {isLoading ? 'Loading...' : user?.email || 'User'}
                        </Text>
                        <Badge color="green" variant="light" size="md">
                            $
                            {isLoading
                                ? '...'
                                : user?.balance?.toFixed(2) || '0.00'}
                        </Badge>
                    </Flex>
                    <Button variant="light" color="red" onClick={handleLogout}>
                        Logout
                    </Button>
                </Group>
            </Flex>
            <Space h="xl" />
            <Paper shadow="sm" p="md" radius="md" withBorder>
                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List grow>
                        <Tabs.Tab value="orders">My Orders</Tabs.Tab>
                        <Tabs.Tab value="create">Create Order</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="orders" pt="xl">
                        <OrdersList />
                    </Tabs.Panel>

                    <Tabs.Panel value="create" pt="xl">
                        <CreateOrderForm
                            onSuccess={() => setActiveTab('orders')}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Container>
    )
}
