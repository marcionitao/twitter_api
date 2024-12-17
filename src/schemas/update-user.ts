import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .optional(),
  bio: z.string().optional(),
  links: z.string().url('Invalid URL').optional(),
})
