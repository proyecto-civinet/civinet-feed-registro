const { Router } = require('express')
const { getUsuarios, getUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuariosController')
const { verificarToken } = require('../middleware/auth')

const router = Router()

router.get('/',       verificarToken, getUsuarios)
router.get('/:id',    verificarToken, getUsuario)
router.put('/:id',    verificarToken, updateUsuario)
router.delete('/:id', verificarToken, deleteUsuario)

module.exports = router