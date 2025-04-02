import { z } from 'zod'
import { ApiErrorDataSchema } from './api.contracts'

export type ApiErrorData = z.infer<typeof ApiErrorDataSchema>
