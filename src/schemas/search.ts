import { z } from 'zod'

export const searchSchema = z.object({
  q: z
    .string({ message: 'Query is required' })
    .min(3, { message: 'Query must be at least 3 characters long' }),
  page: z.coerce.number().min(0).optional(),
})
