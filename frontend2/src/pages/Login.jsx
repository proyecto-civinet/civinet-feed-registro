import { useState } from 'react'
import { loginUsuario } from '../services/api'

export default function Login({ setPage, onLogin }) {
  const [form, setForm]   = useState({ correo: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.correo || !form.password) {
      return setError('Correo y contraseña son obligatorios.')
    }

    setLoading(true)
    try {
      const { data } = await loginUsuario({
        correo:   form.correo,
        password: form.password
      })
      localStorage.setItem('civinet_token',   data.token)
      localStorage.setItem('civinet_usuario', JSON.stringify(data.usuario))
      onLogin(data.usuario)
      setPage('inicio')
    } catch (err) {
      setError(err.response?.data?.error || 'Correo o contraseña incorrectos.')
    }
    setLoading(false)
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>🌱 CiviNet</div>

        <h2 style={styles.titulo}>Iniciar sesión</h2>

        {error && <div style={styles.alertError}>⚠️ {error}</div>}

        {/* Correo */}
        <label style={styles.label}>Correo electrónico</label>
        <input
          style={styles.input}
          type="email"
          placeholder="tu@correo.com"
          value={form.correo}
          onChange={set('correo')}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />

        {/* Contraseña */}
        <label style={styles.label}>Contraseña</label>
        <input
          style={styles.input}
          type="password"
          placeholder="Tu contraseña"
          value={form.password}
          onChange={set('password')}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />

        {/* Botón entrar */}
        <button
          style={{ ...styles.btnPrimario, opacity: loading ? 0.7 : 1 }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        {/* Link a registro */}
        <p style={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <span style={styles.link} onClick={() => setPage('registro')}>
            Crear cuenta CiviNet
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0f7f6 0%, #f0f9ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: "'DM Sans', sans-serif"
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 40px rgba(10,165,160,0.12)',
    border: '1px solid rgba(10,165,160,0.15)'
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem',
    color: '#0aa5a0',
    marginBottom: '1.2rem',
    fontWeight: 700
  },
  titulo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '0.3rem'
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    marginBottom: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#0f172a'
  },
  btnPrimario: {
    width: '100%',
    padding: '0.8rem',
    background: '#0aa5a0',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '1rem',
    fontFamily: 'inherit'
  },
  switchText: {
    textAlign: 'center',
    fontSize: '0.88rem',
    color: '#64748b'
  },
  link: {
    color: '#0aa5a0',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  alertError: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    fontSize: '0.88rem',
    marginBottom: '1rem'
  }
}
