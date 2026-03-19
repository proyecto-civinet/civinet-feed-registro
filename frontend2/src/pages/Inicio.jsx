import { useState, useEffect } from 'react'

// ── CARRUSEL ─────────────────────────────────────────────
function Carrusel() {
  const [imagenes] = useState([
    { url: 'https://res.cloudinary.com/dslcwmoc6/image/upload/v1773402651/protectoras-de-animales_lhg0rw.jpg', texto: 'Juntos construimos un mejor mañana' },
    { url: 'https://res.cloudinary.com/dslcwmoc6/image/upload/v1772805371/FOTO-WEB-DIBUJANDO-UN-MA_C3_91ANA-1_esrvs2.jpg', texto: 'Tu donación transforma vidas' },
    { url: 'https://res.cloudinary.com/dslcwmoc6/image/upload/v1773402985/corazon_yblnof.png', texto: 'Conectamos corazones solidarios' }
  ])
  const [actual, setActual] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActual(p => (p + 1) % imagenes.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [imagenes.length])

  const anterior  = () => setActual(p => (p - 1 + imagenes.length) % imagenes.length)
  const siguiente = () => setActual(p => (p + 1) % imagenes.length)

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 260, borderRadius: 16, overflow: 'hidden', minHeight: 280, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
      <img
        src={imagenes[actual].url}
        alt={imagenes[actual].texto}
        style={{ width: '100%', height: '100%', minHeight: 280, objectFit: 'cover', display: 'block' }}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '1.5rem 1rem 1rem', color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
        {imagenes[actual].texto}
      </div>
      <button onClick={anterior} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: '1.2rem', backdropFilter: 'blur(4px)' }}>‹</button>
      <button onClick={siguiente} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: '1.2rem', backdropFilter: 'blur(4px)' }}>›</button>
      <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: '0.4rem' }}>
        {imagenes.map((_, i) => (
          <div key={i} onClick={() => setActual(i)} style={{ width: i === actual ? 20 : 8, height: 8, borderRadius: 999, background: i === actual ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  )
}

// ── INICIO ────────────────────────────────────────────────
export default function Inicio({ setPage }) {
  const stats = [
    { n: '+5.000', l: 'Donantes activos' },
    { n: '100%',   l: 'Transparencia'    },
    { n: '24/7',   l: 'Seguimiento'      }
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroH1}>
            Conectamos personas solidarias con causas que transforman vidas.
          </h1>
          <p style={styles.heroP}>
            CiviNet une a donantes, ONGs y voluntarios en una sola plataforma.
            Dona como invitado sin crear cuenta o regístrate para seguir el impacto de tus aportes.
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.btnPrimario}>Donar ahora</button>
            <button style={styles.btnFantasma}>Ver historias</button>
          </div>
          <div style={styles.stats}>
            {stats.map(s => (
              <div key={s.n} style={styles.stat}>
                <div style={styles.statNum}>{s.n}</div>
                <div style={styles.statLabel}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <Carrusel />
      </div>

      {/* MISIÓN */}
      <div style={styles.seccion}>
        <h2 style={styles.seccionTitulo}>Misión</h2>
        <p style={styles.seccionSub}>Lo que nos mueve cada día</p>
        <div style={styles.cardsGrid}>
          {[
            { t: 'Nuestra misión', d: 'Facilitar que cada persona pueda apoyar causas sociales de forma segura y transparente, conectando donantes con ONGs verificadas y ofreciendo seguimiento del impacto en tiempo real.' },
            { t: 'Nuestra visión', d: 'Ser la red de referencia para donaciones, apadrinamiento y voluntariado en la ciudad, donde la confianza y la trazabilidad sean el estándar.' },
          ].map(c => (
            <div key={c.t} style={styles.card}>
              <h3 style={styles.cardTitulo}>{c.t}</h3>
              <p style={styles.cardTexto}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NOTICIAS */}
      <div style={styles.noticias}>
        <div style={styles.seccion}>
          <h2 style={styles.seccionTitulo}>Últimas noticias y emergencias</h2>
          <p style={styles.seccionSub}>Historias de impacto y actualizaciones de las causas que apoyas.</p>
          <p style={{ color: '#64748b' }}>
            No hay publicaciones en el feed aún. Cuando las ONGs compartan noticias, verás las actualizaciones aquí.
          </p>
        </div>
      </div>

    </div>
  )
}

const styles = {
  hero: {
    background: '#ffffff',
    padding: '4rem 2rem 5rem',
    display: 'flex', gap: '3rem',
    alignItems: 'center', flexWrap: 'wrap',
    borderBottom: '1px solid #e2e8f0'
  },
  heroLeft: { flex: 1, minWidth: 280 },
  heroH1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(1.8rem,4vw,2.7rem)',
    color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem'
  },
  heroP: {
    color: '#475569', fontSize: '1rem',
    lineHeight: 1.65, maxWidth: 420, marginBottom: '1.6rem'
  },
  heroBtns: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '2rem' },
  btnPrimario: {
    background: '#83CBFF', color: '#fff', border: 'none',
    padding: '0.7rem 1.8rem', borderRadius: '999px',
    fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
  },
  btnFantasma: {
    background: 'transparent', color: '#83CBFF',
    border: '2px solid #569dcf', padding: '0.65rem 1.6rem',
    borderRadius: '999px', fontWeight: 600, cursor: 'pointer'
  },
  stats: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.6rem', color: '#0aa5a0', fontWeight: 700
  },
  statLabel: { fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' },
  seccion: { maxWidth: 1100, margin: '0 auto', padding: '3.5rem 2rem' },
  seccionTitulo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.9rem', marginBottom: '0.5rem', color: '#0f172a'
  },
  seccionSub: { color: '#475569', marginBottom: '2rem' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' },
  card: { background: '#e0f7f6', borderRadius: 14, padding: '1.8rem', border: '1px solid rgba(10,165,160,.2)' },
  cardTitulo: { color: '#077a76', fontWeight: 700, marginBottom: '0.6rem' },
  cardTexto: { color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 },
  noticias: { background: '#f8fafb' },
  footer: {
    background: 'linear-gradient(135deg, #077a76 0%, #1a6fa8 100%)',
    padding: '1.8rem 2rem', textAlign: 'center'
  },
}
