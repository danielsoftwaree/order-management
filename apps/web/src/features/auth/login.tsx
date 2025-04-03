import { useNavigate } from 'react-router-dom'
import { TextInput, PasswordInput, Button, Group, Box } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useLogin } from './auth.api'

export function LoginAuth() {
    const navigate = useNavigate()
    const loginMutation = useLogin()

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email',
            password: (value) =>
                value.length < 6
                    ? 'Password must be at least 6 characters long'
                    : null,
        },
    })

    const handleSubmit = async (values: {
        email: string
        password: string
    }) => {
        try {
            await loginMutation.mutateAsync(values)
            notifications.show({
                title: 'Success',
                message: 'You have successfully logged in',
                color: 'green',
            })
            navigate('/orders')
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Invalid email or password',
                color: 'red',
            })
        }
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Email"
                    placeholder="your@email.com"
                    required
                    {...form.getInputProps('email')}
                    mb="md"
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    {...form.getInputProps('password')}
                    mb="xl"
                />

                <Group justify="center">
                    <Button
                        type="submit"
                        loading={loginMutation.isPending}
                        fullWidth
                    >
                        Login
                    </Button>
                </Group>
            </form>
        </Box>
    )
}
