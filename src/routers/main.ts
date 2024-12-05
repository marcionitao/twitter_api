import { Router } from 'express'
import * as pingController from '../controllers/ping'

// criando nossas rotas
export const mainRouter = Router()

// usando nossas rotas de ping definidas no controller
mainRouter.get('/ping', pingController.ping)
