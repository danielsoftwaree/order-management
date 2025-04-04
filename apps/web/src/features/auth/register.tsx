import { useNavigate } from 'react-router-dom'
import { TextInput, PasswordInput, Button, Group, Box } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useRegister } from './auth.api'

export function RegisterAuth() {
    const navigate = useNavigate()
    const { mutateAsync: register, isPending: isRegisterPending } =
        useRegister()

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validate: {
            name: (value) =>
                value.length < 2
                    ? 'Name must contain at least 2 characters'
                    : null,
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Invalid email',
            password: (value) =>
                value.length < 6
                    ? 'Password must contain at least 6 characters'
                    : null,
        },
    })

    const handleSubmit = async (values: {
        name: string
        email: string
        password: string
    }) => {
        register(values, {
            onSuccess: () => {
                notifications.show({
                    title: 'Registration Successful',
                    message: 'You have successfully registered in the system',
                    color: 'green',
                })
                navigate('/orders')
            },
            onError: (error: any) => {
                const errorMessage =
                    error.response?.data?.error.message ||
                    'An error occurred during registration'

                notifications.show({
                    title: 'Error',
                    message: errorMessage,
                    color: 'red',
                })
            },
        })
        // try {
        //     await registerMutation.mutateAsync(values)
        //     notifications.show({
        //         title: 'Registration Successful',
        //         message: 'You have successfully registered in the system',
        //         color: 'green',
        //     })
        //     navigate('/orders')
        // } catch (error) {
        //     const errorMessage = error.response.data.
        //     notifications.show({
        //         title: 'Error',
        //         message: 'An error occurred during registration',
        //         color: 'red',
        //     })
        // }
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Name"
                    placeholder="Your name"
                    required
                    {...form.getInputProps('name')}
                    mb="md"
                />
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
                    <Button type="submit" loading={isRegisterPending} fullWidth>
                        Register
                    </Button>
                </Group>
            </form>
        </Box>
    )
}
