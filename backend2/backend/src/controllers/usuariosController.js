import supabase from '../config/db.js'

// GET /api/usuarios
export async function getUsuarios(req, res) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, direccion, localidad, fecha_registro')
      .order('fecha_registro', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ usuarios: data, total: data.length })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno.' })
  }
}

// GET /api/usuarios/:id
export async function getUsuario(req, res) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, direccion, localidad, fecha_registro')
      .eq('id_usuario', req.params.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Usuario no encontrado.' })
    return res.status(200).json({ usuario: data })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno.' })
  }
}

// PUT /api/usuarios/:id
export async function updateUsuario(req, res) {
  try {
    const { nombre, telefono, direccion, localidad } = req.body
    const { data, error } = await supabase
      .from('usuarios')
      .update({ nombre, telefono, direccion, localidad })
      .eq('id_usuario', req.params.id)
      .select('id_usuario, nombre, correo, telefono, direccion, localidad, fecha_registro')

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ mensaje: 'Usuario actualizado.', usuario: data[0] })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno.' })
  }
}

// DELETE /api/usuarios/:id
export async function deleteUsuario(req, res) {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id_usuario', req.params.id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno.' })
  }
}