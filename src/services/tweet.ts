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

// verificar se o tweet foi checked
export const checkIfTweetIsLikeByUser = async (slug: string, id: number) => {
  // verificar se o tweet existe no banco de dados
  const isLiked = await prisma.tweetLike.findFirst({
    where: {
      userSlug: slug,
      tweetId: id,
    },
  })
  // return !!isLiked // se for diferente de null, retorna true
  if (isLiked) {
    return true
  }
  return false
}

// remover um like de um tweet
export const unLikeTweet = async (slug: string, id: number) => {
  await prisma.tweetLike.deleteMany({
    where: {
      userSlug: slug,
      tweetId: id,
    },
  })
}
// dar um like em um tweet
export const likeTweet = async (slug: string, id: number) => {
  await prisma.tweetLike.create({
    data: {
      userSlug: slug,
      tweetId: id,
    },
  })
}

// funcionalidade de paginacao
export const findTweetsByUser = async (
  slug: string,
  currentPage: number,
  perPage: number,
) => {
  // buscar os tweets de um determinado usuario
  const tweets = await prisma.tweet.findMany({
    include: {
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
    where: {
      userSlug: slug,
      answerOf: 0, // tweet nao respondido
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: currentPage * perPage, // pular os tweets anteriores, se currentPage = 1, pular 10 tweets
    take: perPage, // pegar apenas 10 tweets
  })

  return tweets
}

// Encontranto os tweets do feed de um determinado usuario
export const findTweetFeed = async (
  following: string[],
  currentPage: number,
  perPage: number,
) => {
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
      userSlug: {
        in: following, // peque onde o usuario que fez o tweet está numa lista
      },
      answerOf: 0, // tweet nao respondido
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: currentPage * perPage, // pular os tweets anteriores, se currentPage = 1, pular 10 tweets
    take: perPage, // pegar apenas 10 tweets
  })
  // função serve para obter a url publica e retornar url concatenada
  for (const tweetIndex in tweets) {
    tweets[tweetIndex].user.avatar = getPublicUrl(
      tweets[tweetIndex].user.avatar,
    )
  }

  return tweets
}
