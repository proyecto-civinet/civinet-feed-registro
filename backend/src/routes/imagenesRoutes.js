const { Router } = require('express')
const { upload } = require('../config/cloudinary')
const { subirImagen, eliminarImagen } = require('../controllers/imagenesController')
const { verificarToken } = require('../middleware/auth')
 
const router = Router()
 
router.post('/subir',      verificarToken, upload.single('imagen'), subirImagen)
router.delete('/:publicId', verificarToken, eliminarImagen)
 
module.exports = router
