import express, { urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { mainRouter } from './routers/main'

const app = express()

app.use(helmet()) // helmet serve para proteger os cabeçalhos HTTP e evitar ataques de segurança
app.use(cors()) // cors serve para permitir a comunicação entre o front e o back
// CORS is enabled for the selected origins
// app.use(
//   cors({
//     origin: 'http://localhost:5500',
//   }),
// )

app.use(urlencoded({ extended: true })) // permitir que o servidor lide com requisições que contenham dados em formato de URL encoded, como formulários HTML.
app.use(express.json()) //  o Express.js retorna uma resposta no formato JSON

// usando rotas definidas no "routers/main.ts"
app.use(mainRouter)

// routers
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.BASE_URL}`)
})
