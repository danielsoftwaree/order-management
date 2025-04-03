import { z } from 'zod'
import {
    ApiErrorDataSchema,
    OrderSchema,
    CreateOrderDataSchema,
    ProductSchema,
    CreateProductDataSchema,
    UserSchema,
    LoginDataSchema,
    RegisterDataSchema,
    AuthResponseSchema,
    AnyResponseSchema
} from './api.contracts'

export type ApiErrorData = z.infer<typeof ApiErrorDataSchema>
export type Order = z.infer<typeof OrderSchema>
export type CreateOrderData = z.infer<typeof CreateOrderDataSchema>
export type Product = z.infer<typeof ProductSchema>
export type CreateProductData = z.infer<typeof CreateProductDataSchema>
export type User = z.infer<typeof UserSchema>
export type LoginData = z.infer<typeof LoginDataSchema>
export type RegisterData = z.infer<typeof RegisterDataSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>

export type AnyResponse<T> = z.infer<ReturnType<typeof AnyResponseSchema<T>>>
