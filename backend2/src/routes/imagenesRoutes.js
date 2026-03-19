import { Router } from 'express'
import { upload } from '../config/cloudinary.js'
import { subirImagen, eliminarImagen } from '../controllers/imagenesController.js'
import { verificarToken } from '../middleware/auth.js'

const router = Router()

// Subir imagen (requiere token)
router.post('/subir', verificarToken, upload.single('imagen'), subirImagen)

// Eliminar imagen (requiere token)
router.delete('/:publicId', verificarToken, eliminarImagen)

export default router