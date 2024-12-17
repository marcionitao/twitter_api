import { prisma } from './../utils/prisma'
import { Prisma } from '@prisma/client'
import { getPublicUrl } from '../utils/url'

export const findUserByEmail = async (email: string) => {
  // verificar se o email existe no banco de dados
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (user) {
    return {
      ...user,
      avatar: getPublicUrl(user.avatar),
      cover: getPublicUrl(user.cover),
    }
  }

  return null
}

export const findUserBySlug = async (slug: string) => {
  // verificar se o slug existe no banco de dados
  const user = await prisma.user.findFirst({
    select: {
      avatar: true,
      cover: true,
      slug: true,
      name: true,
      bio: true,
      links: true,
    },
    where: {
      slug,
    },
  })

  if (user) {
    return {
      ...user,
      avatar: getPublicUrl(user.avatar),
      cover: getPublicUrl(user.cover),
    }
  }

  return null
}

export const createUser = async (data: Prisma.UserCreateInput) => {
  // criar um novo usuario no banco de dados
  const newUser = await prisma.user.create({ data })

  return {
    ...newUser,
    avatar: getPublicUrl(newUser.avatar),
    cover: getPublicUrl(newUser.cover),
  }
}

// quantas pessoas o USER segue
export const getUserFollowingCount = async (slug: string) => {
  const count = await prisma.follow.count({
    where: {
      user1Slug: slug,
    },
  })

  return count
}

// quantas pessoas seguem o USER
export const getUserFollowersCount = async (slug: string) => {
  const count = await prisma.follow.count({
    where: {
      user2Slug: slug,
    },
  })

  return count
}
// quantos tweets o USER fez
export const getUserTweetsCount = async (slug: string) => {
  const count = await prisma.tweet.count({
    where: {
      userSlug: slug,
    },
  })

  return count
}
// verificar se um usuario segue outro
export const checkIfFollows = async (user1Slug: string, user2Slug: string) => {
  const follows = await prisma.follow.findFirst({
    where: {
      user1Slug,
      user2Slug,
    },
  })

  if (follows) {
    return true
  }
  return false
}

// o usuario 1 segue o usuario 2
export const follow = async (user1Slug: string, user2Slug: string) => {
  const follows = await prisma.follow.create({
    data: {
      user1Slug,
      user2Slug,
    },
  })

  return follows
}

// o usuario 1 nao segue o usuario 2
export const unfollow = async (user1Slug: string, user2Slug: string) => {
  await prisma.follow.deleteMany({
    where: {
      user1Slug,
      user2Slug,
    },
  })
}

// alterar os dados do usuario
export const updateUserInfo = async (
  slug: string,
  data: Prisma.UserUpdateInput,
) => {
  await prisma.user.update({
    where: {
      slug,
    },
    data,
  })
}

// Quais usuarios que eu sigo(mostrar a lista de feeds de tweets)
export const getUserFollowing = async (slug: string) => {
  const following = []
  const reqFollow = await prisma.follow.findMany({
    select: {
      user2Slug: true,
    },
    where: {
      user1Slug: slug,
    },
  })
  for (const reqItem of reqFollow) {
    following.push(reqItem.user2Slug)
  }
  return following
}
// Listar sugestões de usuarios que eu nao sigo
export const getUserSuggestions = async (slug: string) => {
  // obter os usuarios que eu sigo
  const following = await getUserFollowing(slug)
  // tenho que obter qualquer usuario que eu não sigo incluindo eu mesmo
  const followingPlusMe = [...following, slug] // junta os dois arrays

  // Criamos um type p/ obter Todos os campos de User pk o typescript nao identificar o conteudo SQL da query
  type Suggestion = Pick<
    Prisma.UserGetPayload<Prisma.UserDefaultArgs>,
    'name' | 'avatar' | 'slug'
  >
  // definindo uma query para obter os usuarios que eu nao sigo aleatoriamente
  const suggestions: Suggestion[] = await prisma.$queryRaw`
    SELECT
      name, avatar, slug
    FROM "User"
    WHERE 
      slug NOT IN (${followingPlusMe.join(', ')})
    ORDER BY RANDOM()
    LIMIT 2
  `

  for (const sugIndex in suggestions) {
    suggestions[sugIndex].avatar = getPublicUrl(suggestions[sugIndex].avatar)
  }
}
