import { Router } from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import { verifyJWT } from '../utils/jwt'
import swaggerDocument from '../../swagger.json'
import swaggerUi from 'swagger-ui-express'
// criando nossas rotas
export const mainRouter = Router()

// configurando o swagger
mainRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// usando nossas rotas de ping definidas no controller
mainRouter.get('/ping', pingController.ping)
// rota para testar se o usuario esta autenticado
mainRouter.get('/privateping', verifyJWT, pingController.privatePing)
// rota para criar usuario
mainRouter.post('/auth/signup', authController.signup)
// rota para fazer login
mainRouter.post('/auth/signin', authController.signin)
// --> Proteger as rotas abaixo com o middleware de autenticação
// rota para criar tweet
// mainRouter.post('/tweet')
// rota para obter 1 tweet
// mainRouter.get('/tweet/:id')
// rota para obter as respostas de um tweet
// mainRouter.get('/tweet/:id/answers')
// rota para dar um like em um tweet
// mainRouter.post('/tweet/:id/like')
// rota para obter dados de um usuario
// mainRouter.get('/user/:slug')
// rota para obter os tweets de um usuario
// mainRouter.get('/user/:slug/tweets')
// rota seguir um usuario
// mainRouter.post('/user/:slug/follow')
// rota para atualizar o usuario
// mainRouter.put('/user')
// rota para atualizar o avatar do usuario
// mainRouter.put('/user/avatar')
// rota para atualizar o cover do usuario
// mainRouter.put('/user/cover')
// rota para obter o feed
// mainRouter.get('/feed')
// rota para obter buscar
// mainRouter.get('/search')
// rota para obter os trendings
// mainRouter.get('/trendings')
// rota para obter as sugestoes
// mainRouter.get('/suggestions')
