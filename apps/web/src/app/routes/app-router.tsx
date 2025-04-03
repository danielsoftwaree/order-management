import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthPage } from '@/pages/auth/auth-page'
import { OrdersPage } from '@/pages/orders/orders-page'
import { useEffect, useState } from 'react'
import { tokenStorage } from '@/shared/tokenStorage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const token = tokenStorage.getToken()
        setIsAuthenticated(!!token)
    }, [])

    if (isAuthenticated === null) {
        return null
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function GuestRoute({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const token = tokenStorage.getToken()
        setIsAuthenticated(!!token)
    }, [])

    if (isAuthenticated === null) {
        return null
    }

    return isAuthenticated ? <Navigate to="orders" replace /> : <>{children}</>
}

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <GuestRoute>
                <AuthPage />
            </GuestRoute>
        ),
    },
    {
        path: '/orders',
        element: (
            <ProtectedRoute>
                <OrdersPage />
            </ProtectedRoute>
        ),
    },
])

export function AppRouter() {
    return <RouterProvider router={router} />
}
