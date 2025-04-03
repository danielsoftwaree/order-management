import { useEffect } from 'react'
import { useGetOrders } from '@/entities/order/order.api'
import { useOrdersStore } from '@/features/order-list/store/orders-store'
import { OrdersTable } from './orders-table'
import { OrdersLoader, OrdersError, EmptyOrdersList } from './orders-state'
import { Order } from './types'
import { useGetProducts } from '@/entities/product/product.api'
import { Product } from '@/shared/api/api.types'
import { useGetCurrentUser } from '@/entities/user/user.api'

export function OrdersList() {
    const { setOrders } = useOrdersStore()

    const { data: user } = useGetCurrentUser()
    const { data: orders, isLoading, error } = useGetOrders(user?.id || '')
    const { data: products } = useGetProducts()

    useEffect(() => {
        if (orders) {
            setOrders(orders)
        }
    }, [orders, setOrders])

    if (isLoading || !user) {
        return <OrdersLoader />
    }

    if (error) {
        return <OrdersError error={error} />
    }

    if (!orders || orders.length === 0) {
        return <EmptyOrdersList />
    }

    return (
        <OrdersTable
            orders={orders as Order[]}
            products={products as Product[]}
        />
    )
}
