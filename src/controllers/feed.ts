import { getUserFollowing } from './../services/user'
import { feedSchema } from '../schemas/feed'
import { ExtendedRequest } from '../types/extended-request'
import { Response } from 'express'
import { findTweetFeed } from '../services/tweet'

export const getFeed = async (req: ExtendedRequest, res: Response) => {
  // receber a paginação de feed
  // validar os dados do recebidos
  const safeData = feedSchema.safeParse(req.query) // "safeParse" serve para validar os dados recebidos

  if (!safeData.success) {
    // "flatten().fieldErrors" serve para obter os erros de cada campo
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  // funcionalidade de paginacao
  const perPage = 10 // 10 tweets por pagina
  const currentPage = safeData.data.page ?? 0 // 0 pagina atual

  // Quais usuarios que eu sigo(serão estes feeds a serem mostrados)
  const following = await getUserFollowing(req.userSlug as string)
  const tweets = await findTweetFeed(following, currentPage, perPage)

  res.json({ tweets, page: currentPage })
}
