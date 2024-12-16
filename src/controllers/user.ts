import { userTweetsSchema } from '../schemas/user-tweets'
import { findTweetsByUser } from '../services/tweet'
import {
  findUserBySlug,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetsCount,
} from '../services/user'
import { ExtendedRequest } from '../types/extended-request'
import { Response } from 'express'

export const getUser = async (req: ExtendedRequest, res: Response) => {
  // obter o slug do usuario via params
  const { slug } = req.params

  // obter o usuario via slug
  const user = await findUserBySlug(slug)
  if (!user) {
    res.json({ error: 'User not found' })
    return
  }

  const followingCount = await getUserFollowingCount(user.slug)
  const followersCount = await getUserFollowersCount(user.slug)
  const tweetsCount = await getUserTweetsCount(user.slug)

  res.json({ user, followingCount, followersCount, tweetsCount })
}

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
  // definir um processo de paginacao
  // obter o slug do usuario via params
  const { slug } = req.params

  // validar os dados do recebidos do Zod
  const safeData = userTweetsSchema.safeParse(req.query) // "safeParse" serve para validar os dados recebidos
  if (!safeData.success) {
    // "flatten().fieldErrors" serve para obter os erros de cada campo
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  // funcionalidade de paginacao
  const perPage = 10 // 10 tweets por pagina
  const currentPage = safeData.data.page ?? 0 // 0 pagina atual

  // função para obter os tweets de um determinado usuario com paginacao
  const tweets = await findTweetsByUser(slug, currentPage, perPage)
  res.json({ tweets, perPage, currentPage })
}
