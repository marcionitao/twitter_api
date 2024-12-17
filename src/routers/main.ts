import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import * as tweetController from '../controllers/tweet'
import * as feedController from '../controllers/feed'
import * as searchController from '../controllers/search'
import * as userController from '../controllers/user'
import * as trendController from '../controllers/trend'

import { verifyJWT } from '../utils/jwt'
import swaggerDocument from '../../swagger.json'

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
mainRouter.post('/tweet', verifyJWT, tweetController.addTweet)
// rota para obter 1 tweet
mainRouter.get('/tweet/:id', verifyJWT, tweetController.getTweet)
// rota para obter as respostas de um tweet
mainRouter.get('/tweet/:id/answers', verifyJWT, tweetController.getAnswers)
// rota para dar um like em um tweet
mainRouter.post('/tweet/:id/like', verifyJWT, tweetController.likeToggle)
// rota para obter dados de um usuario
mainRouter.get('/user/:slug', verifyJWT, userController.getUser)
// rota para obter os tweets de um usuario com paginacao
mainRouter.get('/user/:slug/tweets', verifyJWT, userController.getUserTweets)
// rota seguir um usuario
mainRouter.post('/user/:slug/follow', verifyJWT, userController.followToggle)
// rota para atualizar o usuario
mainRouter.put('/user', verifyJWT, userController.updateUser)
// rota para atualizar o avatar do usuario
// mainRouter.put('/user/avatar')
// rota para atualizar o cover do usuario
// mainRouter.put('/user/cover')
// rota para obter o feed
mainRouter.get('/feed', verifyJWT, feedController.getFeed)
// rota para obter buscar
mainRouter.get('/search', verifyJWT, searchController.searchTweets)
// rota para obter os trendings
mainRouter.get('/trending', verifyJWT, trendController.getTrends)
// rota para obter as sugestoes
// mainRouter.get('/suggestions')
