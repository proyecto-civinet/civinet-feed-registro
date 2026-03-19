const { Router } = require('express')
const { registro, login, perfil } = require('../controllers/authController')
const { verificarToken } = require('../middleware/auth')
 
const router = Router()
 
router.post('/registro', registro)
router.post('/login',    login)
router.get('/perfil',    verificarToken, perfil)
 
module.exports = router