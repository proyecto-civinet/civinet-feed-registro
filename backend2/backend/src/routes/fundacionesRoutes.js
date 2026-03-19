import { Router } from 'express'
import { registroFundacion, loginFundacion, getFundaciones, getFundacion } from '../controllers/fundacionesController.js'
import { verificarToken } from '../middleware/auth.js'

const router = Router()

router.post('/registro', registroFundacion)
router.post('/login',    loginFundacion)
router.get('/',          verificarToken, getFundaciones)
router.get('/:id',       verificarToken, getFundacion)

export default router