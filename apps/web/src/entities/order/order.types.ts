import { z } from "zod"
import { OrdersSchema } from "./order.contracts"
import { OrderSchema } from "./order.contracts"

export type Order = z.infer<typeof OrderSchema>
export type OrdersResponse = z.infer<typeof OrdersSchema>