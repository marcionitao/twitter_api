// função serve para obter a url publica e retornar url concatenada
export const getPublicUrl = (url: string) => {
  return `${process.env.BASE_URL}/${url}`
}
