import { addTweetSchema } from '../schemas/add-tweet'
import { createTweet, findTweet } from '../services/tweet'
import { ExtendedRequest } from '../types/extended-request'
import { Response } from 'express'
import { addHashTag } from '../services/trend'

// "ExtendedRequest" serve para saber quem está autenticado
export const addTweet = async (req: ExtendedRequest, res: Response) => {
  // validar os dados enviados
  const safeData = addTweetSchema.safeParse(req.body) // "safeParse" serve para validar os dados recebidos

  if (!safeData.success) {
    // "flatten().fieldErrors" serve para obter os erros de cada campo
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  // verificar se é resposta, se é o tweet principal ou se é uma resposta
  if (safeData.data.answer) {
    const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer))
    if (!hasAnswerTweet) {
      res.json({ error: 'Tweet not found' })
      return
    }
  }
  // criar o tweet
  const newTweet = await createTweet(
    req.userSlug as string,
    safeData.data.body,
    safeData.data.answer ? parseInt(safeData.data.answer) : 0,
  )
  // se há alguma hashtag no body do tweet, vamos usar expressao regular para extrair as hashtags
  const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g)
  // se houver alguma hashtag, vamos adicionar ao banco de dados
  if (hashtags) {
    for (const hashtag of hashtags) {
      if (hashtag.length >= 2) {
        await addHashTag(hashtag)
      }
    }
  }
  res.json({ tweet: newTweet })
}

export const getTweet = async (req: ExtendedRequest, res: Response) => {
  // obter o id do tweet
  const { id } = req.params
  // obter o tweet
  const tweet = await findTweet(parseInt(id))
  if (!tweet) {
    res.json({ error: 'Tweet not found' })
    return
  }

  // se encontrar, retornar o tweet
  res.json({ tweet })
}
