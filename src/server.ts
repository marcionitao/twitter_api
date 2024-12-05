import express, { urlencoded } from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(helmet()) // helmet serve para proteger os cabeçalhos HTTP e evitar ataques de segurança
app.use(cors()) // cors serve para permitir a comunicação entre o front e o back
app.use(urlencoded({ extended: true })) // permitir que o servidor lide com requisições que contenham dados em formato de URL encoded, como formulários HTML.
app.use(express.json()) //  o Express.js retorna uma resposta no formato JSON

// routers
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.BASE_URL}`)
})
