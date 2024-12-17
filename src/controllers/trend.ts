import { getTrending } from '../services/trend'
import { ExtendedRequest } from '../types/extended-request'
import { Response } from 'express'

export const getTrends = async (req: ExtendedRequest, res: Response) => {
  const trends = await getTrending()
  res.json({ trends })
}
