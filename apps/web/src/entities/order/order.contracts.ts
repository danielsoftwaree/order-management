import { z } from "zod";

export const OrderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    productId: z.string(),
    quantity: z.number(),
    totalPrice: z.number(),
    createdAt: z.string(),
});

export const OrdersSchema = z.object({
    orders: z.array(OrderSchema),
    ordersCount: z.number(),
})
