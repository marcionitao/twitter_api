import { z } from 'zod'

export const signupSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email' }),
  password: z
    .string({ message: 'Password is required' })
    .min(4, { message: 'Password must be at least 4 characters long' }),
  name: z
    .string({ message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters long' }),
})
