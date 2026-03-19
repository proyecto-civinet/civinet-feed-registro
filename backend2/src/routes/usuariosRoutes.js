import { Router } from 'express'
import { getUsuarios, getUsuario, updateUsuario, deleteUsuario } from '../controllers/usuariosController.js'
import { verificarToken } from '../middleware/auth.js'

const router = Router()

// Todas requieren token
router.get('/',      verificarToken, getUsuarios)
router.get('/:id',   verificarToken, getUsuario)
router.put('/:id',   verificarToken, updateUsuario)
router.delete('/:id',verificarToken, deleteUsuario)

export default router