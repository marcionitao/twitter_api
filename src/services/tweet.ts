import { prisma } from '../utils/prisma'
import { getPublicUrl } from '../utils/url'

export const findTweet = async (id: number) => {
  // verificar se o tweet existe no banco de dados
  const tweet = await prisma.tweet.findFirst({
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
          slug: true,
        },
      },
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
    where: {
      id,
    },
  })

  if (tweet) {
    tweet.user.avatar = getPublicUrl(tweet.user.avatar)
    return tweet
  }

  return null
}

export const createTweet = async (
  slug: string,
  body: string,
  answer?: number,
) => {
  // criar um novo tweet no banco de dados
  const newTweet = await prisma.tweet.create({
    data: {
      body,
      userSlug: slug,
      answerOf: answer ?? 0,
    },
  })

  return newTweet
}

// precisamos buscar respostas de um determinado tweet
export const findAnswersFromTweet = async (id: number) => {
  // buscar as respostas de um ou mais tweets
  const tweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
          slug: true,
        },
      },
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
    where: {
      answerOf: id,
    },
  })
  // atualizar o avatar das respostas
  for (const tweetIndex in tweets) {
    tweets[tweetIndex].user.avatar = getPublicUrl(
      tweets[tweetIndex].user.avatar,
    )
  }
  return tweets
}
