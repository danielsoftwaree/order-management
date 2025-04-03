import { ProductsSchema, ProductSchema } from "./product.contracts"
import { z } from "zod"

export type Product = z.infer<typeof ProductSchema>
export type Products = z.infer<typeof ProductsSchema>