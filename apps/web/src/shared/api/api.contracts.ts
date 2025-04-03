import { z } from 'zod'

export const ApiErrorDataSchema = z.array(z.string())

export const OrderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    productId: z.string(),
    quantity: z.number(),
    totalPrice: z.number(),
    createdAt: z.string()
})

export const CreateOrderDataSchema = z.object({
    productId: z.string(),
    quantity: z.number()
})

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    stock: z.number()
})

export const CreateProductDataSchema = z.object({
    name: z.string(),
    price: z.number(),
    stock: z.number()
})

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    balance: z.number()
})

export const LoginDataSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const RegisterDataSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})

export const AuthResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        user: UserSchema,
        access_token: z.string()
    })
})

export const AnyResponseSchema = <T>(schema: z.ZodSchema<T>) => z.object({
    success: z.boolean(),
    data: schema
})

export const ProductResponseSchema = AnyResponseSchema(ProductSchema)
