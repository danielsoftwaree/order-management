import { z } from 'zod'

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
})

export const ProductsSchema = z.array(ProductSchema)
