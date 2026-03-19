const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const supabase = require('../config/db')

async function registroFundacion(req, res) {
  try {
    const { nombre, nit, tipo, direccion, localidad, correo, telefono,
            password, representante_legal,
            doc_camara_comercio, doc_rut, doc_cedula_rep, doc_estatutos } = req.body

    if (!nombre || !nit || !correo || !password || !tipo) {
      return res.status(400).json({ error: 'Nombre, NIT, tipo, correo y contraseña son obligatorios.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres.' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ error: 'El correo no tiene un formato válido.' })
    }

    const { data: existe } = await supabase
      .from('fundaciones')
      .select('id_fundaciones')
      .eq('correo', correo.toLowerCase())
      .single()

    if (existe) {
      return res.status(409).json({ error: 'Ya existe una fundación registrada con ese correo.' })
    }

    const salt         = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const { data, error } = await supabase
      .from('fundaciones')
      .insert([{
        nombre:              nombre.trim(),
        nit:                 nit.trim(),
        tipo,
        direccion:           direccion || null,
        localidad:           localidad || null,
        correo:              correo.toLowerCase().trim(),
        telefono:            telefono || null,
        representante_legal: representante_legal || null,
        password_hash:       passwordHash,
        doc_camara_comercio: doc_camara_comercio || null,
        doc_rut:             doc_rut || null,
        doc_cedula_rep:      doc_cedula_rep || null,
        doc_estatutos:       doc_estatutos || null,
        estado:              'pendiente',
        fecha_registro:      new Date().toISOString()
      }])
      .select('id_fundaciones, nombre, nit, tipo, correo, estado, fecha_registro')

    if (error) {
      console.error('Error Supabase registro fundacion:', error)
      return res.status(500).json({ error: 'Error al registrar la fundación. Intenta de nuevo.' })
    }

    const fundacion = data[0]
    const token = jwt.sign(
      { id: fundacion.id_fundaciones, correo: fundacion.correo, nombre: fundacion.nombre, tipo: 'fundacion' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({ mensaje: '¡Fundación registrada! Su solicitud está en revisión.', token, fundacion })

  } catch (err) {
    console.error('Error en registro fundacion:', err)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

async function loginFundacion(req, res) {
  try {
    const { correo, password } = req.body

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' })
    }

    const { data: fundacion, error } = await supabase
      .from('fundaciones')
      .select('id_fundaciones, nombre, nit, correo, password_hash, tipo, estado, fecha_registro')
      .eq('correo', correo.toLowerCase().trim())
      .single()

    if (error || !fundacion) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    }

    const passwordValida = await bcrypt.compare(password, fundacion.password_hash)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
    }

    const token = jwt.sign(
      { id: fundacion.id_fundaciones, correo: fundacion.correo, nombre: fundacion.nombre, tipo: 'fundacion' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password_hash, ...fundacionSinPassword } = fundacion
    return res.status(200).json({ mensaje: `¡Bienvenida, ${fundacion.nombre}!`, token, fundacion: fundacionSinPassword })

  } catch (err) {
    console.error('Error en login fundacion:', err)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

async function getFundaciones(req, res) {
  try {
    const { data, error } = await supabase
      .from('fundaciones')
      .select('id_fundaciones, nombre, nit, tipo, direccion, localidad, correo, telefono, estado, fecha_registro')
      .order('fecha_registro', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ fundaciones: data, total: data.length })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno.' })
  }
}

async function getFundacion(req, res) {
  try {
    const { data, error } = await supabase
      .from('fundaciones')
      .select('id_fundaciones, nombre, nit, tipo, direccion, localidad, correo, telefono, estado, fecha_registro')
      .eq('id_fundaciones', req.params.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Fundación no encontrada.' })
    return res.status(200).json({ fundacion: data })
  } catch (err) {
    return res.status(500).json({ error: 'Error interno.' })
  }
}

module.exports = { registroFundacion, loginFundacion, getFundaciones, getFundacion }