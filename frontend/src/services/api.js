import axios from 'axios'

const API = axios.create({
 baseURL: 'http://localhost:4000/api'
})

// Agrega el token automáticamente a cada petición si existe
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('civinet_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Auth ──────────────────────────────────────────
export const registrarUsuario = (datos) => API.post('/auth/registro', datos)
export const loginUsuario     = (datos) => API.post('/auth/login', datos)
export const getPerfil        = ()       => API.get('/auth/perfil')

// ── Fundaciones ───────────────────────────────────────────
export const registrarFundacion = (datos) => API.post('/fundaciones/registro', datos)
export const loginFundacion     = (datos) => API.post('/fundaciones/login', datos)
export const getFundaciones     = ()       => API.get('/fundaciones')

export default API