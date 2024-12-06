import { RequestHandler } from 'express'

export const signup: RequestHandler = async (req, res) => {
  res.json({ success: true })
}
