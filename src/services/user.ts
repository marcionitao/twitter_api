import { prisma } from '../utils/prisma'
import { getPublicUrl } from '../utils/url'

export const findUserByEmail = async (email: string) => {
  // verificar se o email existe no banco de dados
  const user = await prisma.user.findUnique({
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
