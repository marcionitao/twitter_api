import { RequestHandler } from 'express'
import { signupSchema } from '../schemas/signup'
import { findUserByEmail, findUserBySlug } from '../services/user'
import slug from 'slug'
import { hash } from 'bcrypt-ts'

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
  let genSlug = true
  let userSlug = slug(safeData.data.name) // gerar slug do nome do usuario usando a lib "slug"
  while (genSlug) {
    // enquanto o slug nao estiver disponivel, gerar outro slug
    const hasSlug = await findUserBySlug(userSlug)
    if (hasSlug) {
      // se houver um usuario com esse slug, gerar um novo slug concatenando um numero aleatorio
      userSlug = slug(
        `${userSlug}-${Math.floor(Math.random() * 999999).toString()}`,
      )
    } else {
      genSlug = false
    }
  }
  // gerar hash da senha
  // "hash" serve para gerar um hash da senha usando a lib "bcrypt-ts".
  // Nunca aguardar a pass original do user no DB, antes devemos gerar um hash da password e dpois armazenar o hash no DB
  const hashPassword = await hash(safeData.data.password, 10)

  // criar o usuario
  // enviar os dados para o service
  const newUser = await createUser({
    slug: userSlug,
    name: safeData.data.name,
    email: safeData.data.email,
    password: hashPassword,
  })
  // criar token
  // retornar o token e o usuario
  res.json({ success: true })
}
