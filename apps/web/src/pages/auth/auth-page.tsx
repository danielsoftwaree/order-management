import { useState } from 'react'
import { Container, Title, Tabs, Paper, Text, Space } from '@mantine/core'
import { LoginAuth } from '@/features/auth/login'
import { RegisterAuth } from '@/features/auth/register'

export function AuthPage() {
    const [activeTab, setActiveTab] = useState<string | null>('login')

    return (
        <Container size="xs" pt={40}>
            <Paper shadow="md" p="xl" radius="md" withBorder>
                <Title order={2} ta="center" mt="md" mb={30}>
                    Order Management System
                </Title>
                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List grow>
                        <Tabs.Tab value="login">Login</Tabs.Tab>
                        <Tabs.Tab value="register">Register</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="login" pt="xl">
                        <LoginAuth />
                    </Tabs.Panel>

                    <Tabs.Panel value="register" pt="xl">
                        <RegisterAuth />
                    </Tabs.Panel>
                </Tabs>
            </Paper>
            <Space h="lg" />
            <Text size="md" ta="center" mb="md" c="dimmed">
                Registration is very simple and takes only 10 seconds! 😊
            </Text>
        </Container>
    )
}
