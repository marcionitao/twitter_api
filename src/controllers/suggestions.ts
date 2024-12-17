import { getUserSuggestions } from '../services/user'
import { ExtendedRequest } from '../types/extended-request'
import { Response } from 'express'

export const getSuggestions = async (req: ExtendedRequest, res: Response) => {
  // queremos sugestoes de usuarios que eu nao sigo
  const suggestions = await getUserSuggestions(req.userSlug as string)
  res.json({ users: suggestions })
}
