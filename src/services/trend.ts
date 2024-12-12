import { prisma } from '../utils/prisma'

export const addHashTag = async (hashtag: string) => {
  // verificar se a hashtag ja existe no banco de dados
  const hs = await prisma.trend.findFirst({
    where: {
      hastag: hashtag,
    },
  })
  // se houver uma hashtag, vamos incrementar o contador e atualizar a data
  if (hs) {
    await prisma.trend.update({
      where: {
        id: hs.id,
      },
      data: {
        counter: hs.counter + 1,
        updatedAt: new Date(),
      },
    })
  } else {
    // se nao houver uma hashtag, vamos criar uma nova
    await prisma.trend.create({
      data: {
        hastag: hashtag,
      },
    })
  }
}