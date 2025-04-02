import { createHashRouter, RouterProvider } from 'react-router-dom'

const router = createHashRouter([
    {
        path: '/',
        element: <></>,
    },
])
export function AppRouter() {
    return <RouterProvider router={router} />
}
