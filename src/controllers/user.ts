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
