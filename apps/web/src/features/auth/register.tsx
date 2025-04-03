import { useNavigate } from 'react-router-dom'
import { TextInput, PasswordInput, Button, Group, Box } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useRegister } from './auth.api'

export function RegisterAuth() {
    const navigate = useNavigate()
    const registerMutation = useRegister()

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validate: {
            name: (value) =>
                value.length < 2
                    ? 'Имя должно содержать не менее 2 символов'
                    : null,
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : 'Некорректный email',
            password: (value) =>
                value.length < 6
                    ? 'Пароль должен содержать не менее 6 символов'
                    : null,
        },
    })

    const handleSubmit = async (values: {
        name: string
        email: string
        password: string
    }) => {
        try {
            await registerMutation.mutateAsync(values)
            notifications.show({
                title: 'Успешная регистрация',
                message: 'Вы успешно зарегистрировались в системе',
                color: 'green',
            })
            navigate('/orders')
        } catch (error) {
            notifications.show({
                title: 'Ошибка',
                message: 'Произошла ошибка при регистрации',
                color: 'red',
            })
        }
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Имя"
                    placeholder="Ваше имя"
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
                    label="Пароль"
                    placeholder="Ваш пароль"
                    required
                    {...form.getInputProps('password')}
                    mb="xl"
                />

                <Group justify="center">
                    <Button
                        type="submit"
                        loading={registerMutation.isPending}
                        fullWidth
                    >
                        Зарегистрироваться
                    </Button>
                </Group>
            </form>
        </Box>
    )
}
