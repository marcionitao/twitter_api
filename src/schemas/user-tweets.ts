import { z } from 'zod'

// vamos definir o schema para a paginação dos tweets
export const userTweetsSchema = z.object({
  page: z.coerce.number().min(0).optional(), // "coerce" serve para converter o tipo de dado
})
