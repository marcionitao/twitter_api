import { z } from 'zod'

export const feedSchema = z.object({
  page: z.coerce.number().min(0).optional(), // "coerce" serve para converter o tipo de dado
})
