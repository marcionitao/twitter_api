import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { findUserBySlug } from '../services/user'
import { ExtendedRequest } from '../types/extended-request'
// vamos criar um hash para o token
export const createJWT = (slug: string) => {
  return jwt.sign({ slug }, process.env.JWT_SECRET as string)
}
// middleware para verificar se o token do usuario é valido e se ele está autenticado
export const verifyJWT = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  // verificar se a autorização existe(token do usuario)
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ error: 'Access denied!' })
    return
  }

  // obtendo o token do header
  const token = authHeader.split(' ')[1]

  // verificar se o token é valido
  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (error, decoded: any) => {
      if (error) {
        return res.status(401).json({ error: 'Access denied!' })
      }
      // se o token for valido, obter os dados do usuario
      const user = await findUserBySlug(decoded.slug)
      if (!user) {
        return res.status(401).json({ error: 'Access denied!' })
      }
      // saber quem está autenticado
      req.userSlug = user.slug
      next()
    },
  )
}
