import { Table, Badge, ScrollArea } from '@mantine/core'
import { Product } from '@/shared/api/api.types'
interface Order {
    id: string
    productId: string
    quantity: number
    totalPrice: number
    createdAt: string
}

interface OrdersTableProps {
    orders: Order[]
    products: Product[]
}

export const OrdersTable = ({ orders, products }: OrdersTableProps) => (
    <ScrollArea type="auto">
        <Table striped highlightOnHover withTableBorder miw={700}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Total Price</Table.Th>
                    <Table.Th>Created At</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {orders.map((order) => (
                    <Table.Tr key={order.id}>
                        <Table.Td>{order.id.substring(0, 8)}...</Table.Td>
                        <Table.Td>
                            {
                                products.find(
                                    (product) => product.id === order.productId
                                )?.name
                            }
                        </Table.Td>
                        <Table.Td>{order.quantity}</Table.Td>
                        <Table.Td>
                            <Badge color="green" variant="filled">
                                {order.totalPrice.toFixed(2)} $
                            </Badge>
                        </Table.Td>
                        <Table.Td>
                            {new Date(order.createdAt).toLocaleString()}
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </ScrollArea>
)
