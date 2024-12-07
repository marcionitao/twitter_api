import { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma'
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
