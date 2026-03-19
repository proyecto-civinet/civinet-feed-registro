import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes        from './routes/authRoutes.js'
import usuariosRoutes    from './routes/usuariosRoutes.js'
import imagenesRoutes    from './routes/imagenesRoutes.js'
import fundacionesRoutes from './routes/fundacionesRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ── Middlewares globales ───────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Rutas ─────────────────────────────────────────────────
app.use('/api/auth',        authRoutes)
app.use('/api/usuarios',    usuariosRoutes)
app.use('/api/imagenes',    imagenesRoutes)
app.use('/api/fundaciones', fundacionesRoutes)

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', mensaje: 'CiviNet Backend funcionando', version: '1.0.0' })
})

// ── Ruta no encontrada (siempre al final) ─────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada.` })
})

// ── Arrancar servidor ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nCiviNet Backend corriendo en http://localhost:${PORT}`)
  console.log(`Rutas disponibles:`)
  console.log(`   POST  /api/auth/registro`)
  console.log(`   POST  /api/auth/login`)
  console.log(`   GET   /api/auth/perfil        (requiere token)`)
  console.log(`   GET   /api/usuarios            (requiere token)`)
  console.log(`   POST  /api/fundaciones/registro`)
  console.log(`   POST  /api/fundaciones/login`)
  console.log(`   GET   /api/fundaciones         (requiere token)`)
  console.log(`   GET   /api/health\n`)
})