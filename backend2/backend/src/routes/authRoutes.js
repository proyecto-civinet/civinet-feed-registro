import { Router } from 'express'
import { registro, login, perfil } from '../controllers/authController.js'
import { verificarToken } from '../middleware/auth.js'

const router = Router()

// Rutas públicas
router.post('/registro', registro)   // Crear cuenta
router.post('/login', login)         // Iniciar sesión

// Rutas protegidas (requieren JWT)
router.get('/perfil', verificarToken, perfil)  // Ver perfil propio

export default router