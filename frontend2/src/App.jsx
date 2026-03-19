import { useState, useEffect } from 'react'
import Inicio   from './pages/Inicio'
import Registro from './pages/Registro'
import Login    from './pages/Login'

// ── NAVBAR GLOBAL ─────────────────────────────────────────
function Navbar({ setPage, usuario, onLogout }) {
  return (
    <nav style={nav.bar}>
      <span style={nav.logo} onClick={() => setPage('inicio')}>CiviNet</span>
      <div style={nav.links}>
        <span style={nav.link} onClick={() => setPage('inicio')}>Inicio</span>
        <span style={nav.link}>Donar</span>
        {usuario ? (
          <>
            <span style={nav.linkName}> {usuario.nombre?.split(' ')[0]}</span>
            <button style={nav.btnOutline} onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <button style={nav.btnSolid}   onClick={() => setPage('registro')}>Registrarse</button>
            <button style={nav.btnOutline} onClick={() => setPage('login')}>Iniciar sesión</button>
          </>
        )}
      </div>
    </nav>
  )
}

// ── FOOTER GLOBAL ─────────────────────────────────────────
function Footer() {
  return (
    <footer style={foot.bar}>
      <div style={{ marginBottom: '0.4rem' }}>
        <a href="#" style={foot.link}>proyectocivinet@gmail.com</a>
        <a href="#" style={foot.link}>Contacto</a>
      </div>
      <p style={foot.text}>© 2026 CiviNet · Tu ayuda, su esperanza.</p>
    </footer>
  )
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [page,    setPage]    = useState('inicio')
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const guardado = localStorage.getItem('civinet_usuario')
    if (guardado) {
      try { setUsuario(JSON.parse(guardado)) } catch {}
    }
  }, [])

  const onLogin  = (u) => setUsuario(u)
  const onLogout = () => {
    localStorage.removeItem('civinet_token')
    localStorage.removeItem('civinet_usuario')
    setUsuario(null)
    setPage('inicio')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar setPage={setPage} usuario={usuario} onLogout={onLogout} />

      <div style={{ flex: 1 }}>
        {page === 'inicio'   && <Inicio   setPage={setPage} usuario={usuario} onLogout={onLogout} />}
        {page === 'registro' && <Registro setPage={setPage} onLogin={onLogin} />}
        {page === 'login'    && <Login    setPage={setPage} onLogin={onLogin} />}
      </div>

      <Footer />
    </div>
  )
}

// ── ESTILOS NAVBAR ────────────────────────────────────────
const nav = {
  bar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '60px',
    background: 'linear-gradient(135deg, #83CBFF 100%)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 1000
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  links: { display: 'flex', alignItems: 'center', gap: '1rem' },
  link: { color: '#e0f7f6', fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  linkName: { color: '#e0f7f6', fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 },
  btnSolid: {
    padding: '0.4rem 1.1rem', background: '#16a34a', color: '#fff',
    border: 'none', borderRadius: '20px', fontWeight: 700,
    fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
  },
  btnOutline: {
    padding: '0.4rem 1.1rem', background: 'transparent', color: '#fff',
    border: '2px solid #fff', borderRadius: '20px', fontWeight: 700,
    fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
  }
}

// ── ESTILOS FOOTER ────────────────────────────────────────
const foot = {
  bar: {
    background: 'linear-gradient(135deg, #83CBFF 100%)',
    padding: '1.8rem 2rem', textAlign: 'center'
  },
  link: { color: 'rgb(255, 255, 255)', margin: '0 0.5rem', fontSize: '0.88rem', textDecoration: 'none' },
  text: { color: 'rgb(255, 255, 255)', fontSize: '0.82rem', marginTop: '0.4rem' }
}