import { z } from 'zod'

// ficheiro de validação para signin(fazer login)
export const signinSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email' }),
  password: z
    .string({ message: 'Password is required' })
    .min(4, { message: 'Password must be at least 4 characters long' }),
})
