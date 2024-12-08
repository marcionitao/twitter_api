import jwt from 'jsonwebtoken'
// vamos criar um hash para o token
export const createJWT = (slug: string) => {
  return jwt.sign({ slug }, process.env.JWT_SECRET as string)
}
