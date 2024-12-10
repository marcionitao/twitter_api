import { Request } from 'express'

// In other words, this interface defines a custom request object that includes a userSlug property, in addition to the standard properties of an Express request object. Que será usada todas as vezes que desejarmos saber quem está autenticado
export interface ExtendedRequest extends Request {
  userSlug?: string
}
