const { Router } = require('express')
const { registroFundacion, loginFundacion, getFundaciones, getFundacion } = require('../controllers/fundacionesController')
const { verificarToken } = require('../middleware/auth')
 
const router = Router()
 
router.post('/registro', registroFundacion)
router.post('/login',    loginFundacion)
router.get('/',          verificarToken, getFundaciones)
router.get('/:id',       verificarToken, getFundacion)
 
module.exports = router