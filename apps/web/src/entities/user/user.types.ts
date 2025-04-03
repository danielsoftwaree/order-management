import { UserSchema } from "./user.contracts"
import { z } from "zod"

export type User = z.infer<typeof UserSchema>
