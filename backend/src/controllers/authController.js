const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const supabase = require('../config/db')

// POST /api/auth/registro
async function registro(req, res) {
  try {
    const { nombre, correo, password, telefono, direccion, localidad,
            tipo_documento, numero_documento, fecha_nacimiento } = req.body

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres.' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido.' })
    }

    const { data: existe } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('correo', correo.toLowerCase())
      .single()

    if (existe) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' })
    }

    const salt         = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        nombre:           nombre.trim(),
        correo:           correo.toLowerCase().trim(),
        password_hash:    passwordHash,
        telefono:         telefono || null,
        direccion:        direccion || null,
        localidad:        localidad || null,
        tipo_documento:   tipo_documento || null,
        numero_documento: numero_documento || null,
        fecha_nacimiento: fecha_nacimiento || null,
        fecha_registro:   new Date().toISOString()
      }])
      .select('id_usuario, nombre, correo, telefono, direccion, localidad, fecha_registro')

    if (error) {
      console.error('Error Supabase registro:', error)
      return res.status(500).json({ error: 'Error al crear la cuenta. Intenta de nuevo.' })
    }

    const usuarioCreado = data[0]
    const token = jwt.sign(
      { id: usuarioCreado.id_usuario, correo: usuarioCreado.correo, nombre: usuarioCreado.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({ mensaje: '¡Cuenta creada exitosamente!', token, usuario: usuarioCreado })

  } catch (err) {
    console.error('Error en registro:', err)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { correo, password } = req.body

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' })
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, correo, password_hash, telefono, direccion, localidad, fecha_registro')
      .eq('correo', correo.toLowerCase().trim())
      .single()

    if (error || !usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, correo: usuario.correo, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password_hash, ...usuarioSinPassword } = usuario

    return res.status(200).json({ mensaje: `¡Bienvenido, ${usuario.nombre}!`, token, usuario: usuarioSinPassword })

  } catch (err) {
    console.error('Error en login:', err)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

// GET /api/auth/perfil
async function perfil(req, res) {
  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, direccion, localidad, fecha_registro')
      .eq('id_usuario', req.usuario.id)
      .single()

    if (error || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }

    return res.status(200).json({ usuario })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

module.exports = { registro, login, perfil }