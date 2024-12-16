import { userTweetsSchema } from '../schemas/user-tweets'
import { findTweetsByUser } from '../services/tweet'
import {
  checkIfFollows,
  findUserBySlug,
  follow,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetsCount,
  unfollow,
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

export const followToggle = async (req: ExtendedRequest, res: Response) => {
  // obter o slug do usuario via params
  const { slug } = req.params
  const me = req.userSlug as string

  // verificar se o usuario enviado existe
  const hasUserToBeFollowed = await findUserBySlug(slug)
  if (!hasUserToBeFollowed) {
    res.json({ error: 'User not found' })
  }
  // verificar se eu sigo esse usuario
  const follows = await checkIfFollows(me, slug)
  if (!follows) {
    await follow(me, slug)
    res.json({ followed: true }) // eu sigo esse usuario
  } else {
    await unfollow(me, slug)
    res.json({ followed: false }) // eu nao sigo esse usuario
  }
}
