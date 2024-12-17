import { searchSchema } from '../schemas/search'
import { findTweetByBody } from '../services/tweet'
import { ExtendedRequest } from '../types/extended-request'
import { Response } from 'express'

export const searchTweets = async (req: ExtendedRequest, res: Response) => {
  // implementar busca de tweets com paginacao
  const safeData = searchSchema.safeParse(req.query) // "safeParse" serve para validar os dados recebidos

  if (!safeData.success) {
    // "flatten().fieldErrors" serve para obter os erros de cada campo
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const perPage = 10 // 10 tweets por pagina
  const currentPage = safeData.data.page ?? 0 // 0 pagina atual
  // funcionalidade de busca de tweets com paginacao
  const tweets = await findTweetByBody(safeData.data.q, currentPage, perPage)

  res.json({ tweets, page: currentPage })
}
