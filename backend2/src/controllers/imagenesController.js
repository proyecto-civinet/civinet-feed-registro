import { cloudinary } from '../config/cloudinary.js'

export async function subirImagen(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen.' })
    }

    // Subir desde buffer a Cloudinary
    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'civinet', transformation: [{ width: 800, quality: 'auto' }] },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(req.file.buffer)
    })

    return res.status(200).json({
      mensaje:  'Imagen subida exitosamente.',
      url:      resultado.secure_url,
      publicId: resultado.public_id
    })
  } catch (err) {
    console.error('Error subiendo imagen:', err)
    return res.status(500).json({ error: 'Error al subir la imagen.' })
  }
}

export async function eliminarImagen(req, res) {
  try {
    await cloudinary.uploader.destroy(req.params.publicId)
    return res.status(200).json({ mensaje: 'Imagen eliminada.' })
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar la imagen.' })
  }
}