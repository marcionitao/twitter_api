import { z } from 'zod'

// ficheiro de validação para addTweet(criar um novo tweet)
export const addTweetSchema = z.object({
  body: z.string({ message: 'Body is required' }),
  answer: z.string().optional(),
})
