import { RequestHandler } from 'express'
import { signupSchema } from '../schemas/signup'
import { findUserByEmail } from '../services/user'

export const signup: RequestHandler = async (req, res) => {
  // validar os dados do recebidos
  const safeData = signupSchema.safeParse(req.body) // "safeParse" serve para validar os dados recebidos

  if (!safeData.success) {
    // "flatten().fieldErrors" serve para obter os erros de cada campo
    return res.json({ error: safeData.error.flatten().fieldErrors })
  }

  // verificar email(ou seja, se já existe um outro usuario com esse email)
  const hasEmail = await findUserByEmail(safeData.data.email)

  if (hasEmail) {
    return res.json({ error: 'Email already exists' })
  }
  // verificar slug
  // gerar hash da senha
  // criar o usuario
  // criar token
  // retornar o token e o usuario
  res.json({ success: true })
}
