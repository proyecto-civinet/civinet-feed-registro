import { useState } from 'react'
import { registrarUsuario, registrarFundacion } from '../services/api'

const LOCALIDADES = [
  '1. Usaquén', '2. Chapinero', '3. Santa Fe', '4. San Cristóbal',
  '5. Usme', '6. Tunjuelito', '7. Bosa', '8. Kennedy',
  '9. Fontibón', '10. Engativá', '11. Suba', '12. Barrios Unidos',
  '13. Teusaquillo', '14. Los Mártires', '15. Antonio Nariño',
  '16. Puente Aranda', '17. La Candelaria', '18. Rafael Uribe Uribe',
  '19. Ciudad Bolívar', '20. Sumapaz'
]

// ── FORMULARIO USUARIO ────────────────────────────────────
function FormUsuario({ setPage, onLogin }) {
  const [form, setForm] = useState({
    nombre: '', tipoDoc: '', numeroDoc: '', fechaNac: '',
    localidad: '', direccion: '', telefono:'', correo: '',
    password: '', confirmar: '', terminos: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [exito, setExito]     = useState(false)

  const set = (k) => (e) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.nombre || !form.tipoDoc || !form.numeroDoc || !form.fechaNac ||
        !form.localidad || !form.direccion || !form.correo || !form.password || !form.confirmar) {
      return setError('Todos los campos son obligatorios.')
    }
    if (form.password.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres.')
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.')
    if (!form.terminos) return setError('Debes aceptar los términos y condiciones.')

    setLoading(true)
    try {
      const { data } = await registrarUsuario({
        nombre:           form.nombre,
        correo:           form.correo,
        telefono:         form.telefono,
        password:         form.password,
        tipo_documento:   form.tipoDoc,
        numero_documento: form.numeroDoc,
        fecha_nacimiento: form.fechaNac,
        direccion:        form.direccion,
        localidad:        form.localidad 
      })
      localStorage.setItem('civinet_token',   data.token)
      localStorage.setItem('civinet_usuario', JSON.stringify(data.usuario))
      onLogin(data.usuario)
      setExito(true)
      setTimeout(() => setPage('inicio'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta.')
    }
    setLoading(false)
  }

  return (
    <div style={s.formWrap}>
      {error && <div style={s.alertError}> {error}</div>}
      {exito && <div style={s.alertExito}> ¡Cuenta creada! Redirigiendo…</div>}

      {/* Nombre */}
      <label style={s.label}>Nombre completo</label>
      <input style={s.input} placeholder="Ingrese nombre completo" value={form.nombre} onChange={set('nombre')} />

      {/* Tipo de documento */}
      <label style={s.label}>Tipo de documento</label>
      <div style={s.radioGroup}>
        {['CC', 'CE', 'NIT'].map(t => (
          <label key={t} style={s.radioLabel}>
            <input
              type="radio" name="tipoDoc" value={t}
              checked={form.tipoDoc === t} onChange={set('tipoDoc')}
              style={{ accentColor: '#0aa5a0', marginRight: '0.4rem' }}
            />
            {t}
          </label>
        ))}
      </div>

      {/* Número de documento */}
      <label style={s.label}>Número de documento</label>
      <input style={s.input} placeholder="Ingrese su numero de documento" value={form.numeroDoc} onChange={set('numeroDoc')} />

      {/* Fecha de nacimiento */}
      <label style={s.label}>Fecha de nacimiento</label>
      <input style={s.input} type="date" value={form.fechaNac} onChange={set('fechaNac')}
        max={new Date().toISOString().split('T')[0]} />

      {/* Localidad */}
      <label style={s.label}>Localidad de residencia</label>
      <select style={s.select} value={form.localidad} onChange={set('localidad')}>
        <option value="">Seleccione su localidad</option>
        {LOCALIDADES.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      {/* Dirección */}
      <label style={s.label}>Dirección</label>
      <input style={s.input} placeholder="Ingrese su direccion" value={form.direccion} onChange={set('direccion')} />

      {/* Correo */}
      <label style={s.label}>Correo electrónico</label>
      <input style={s.input} type="email" placeholder="Ingrese su correo" value={form.correo} onChange={set('correo')} />

      {/* Teléfono */}
      <label style={s.label}>Teléfono</label>
      <input style={s.input} placeholder="Digite su numero de contacto" value={form.telefono} onChange={set('telefono')} />

      {/* Contraseña */}
      <label style={s.label}>Contraseña</label>
      <input style={s.input} type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} />

      {/* Confirmar */}
      <label style={s.label}>Confirmar contraseña</label>
      <input style={s.input} type="password" placeholder="Confirme su contraseña" value={form.confirmar} onChange={set('confirmar')} />

      {/* Términos */}
      <div style={s.terminosRow}>
        <input type="checkbox" id="terminos" checked={form.terminos} onChange={set('terminos')}
          style={{ marginRight: '0.5rem', accentColor: '#0aa5a0' }} />
        <label htmlFor="terminos" style={s.terminosLabel}>
          Acepto los términos y condiciones de CiviNet
        </label>
      </div>

      <button style={{ ...s.btnPrimario, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>

      <p style={s.switchText}>
        ¿Ya tienes cuenta?{' '}
        <span style={s.link} onClick={() => setPage('login')}>Inicia sesión</span>
      </p>
    </div>
  )
}

// ── FORMULARIO FUNDACIÓN ──────────────────────────────────
function FormFundacion({ setPage }) {
  const [form, setForm] = useState({
    nombre: '', nit: '', direccion: '', localidad:'', telefono:'', tipo: '', correo: '',
    password: '', confirmar: '', terminos: false
  })
  const [docs, setDocs] = useState({
    camaraComercio: null, rut: null, cedulaRep: null, estatutos: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [exito, setExito]     = useState(false)

  const set = (k) => (e) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const setDoc = (k) => (e) => {
    const file = e.target.files[0]
    setDocs(p => ({ ...p, [k]: file }))
  }

const submit = async () => {
  setError('')
  if (!form.nombre || !form.nit || !form.tipo ||
      !form.correo || !form.password || !form.confirmar) {
    return setError('Todos los campos son obligatorios.')
  }
  if (form.password.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres.')
  if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.')
  if (!form.terminos) return setError('Debes aceptar los términos y condiciones.')
  if (!docs.camaraComercio || !docs.rut || !docs.cedulaRep || !docs.estatutos) {
    return setError('Debes adjuntar todos los documentos requeridos.')
  }
  setLoading(true)
  try {
    const { data } = await registrarFundacion({
      nombre:              form.nombre,
      nit:                 form.nit,
      tipo:                form.tipo,
      direccion:           form.direccion,
      localidad:           form.localidad,
      telefono:            form.telefono,
      correo:              form.correo,
      password:            form.password,
      doc_camara_comercio: docs.camaraComercio?.name || null,
      doc_rut:             docs.rut?.name || null,
      doc_cedula_rep:      docs.cedulaRep?.name || null,
      doc_estatutos:       docs.estatutos?.name || null,
    })
    setExito(true)
  } catch (err) {
    setError(err.response?.data?.error || 'Error al registrar la fundación.')
  }
  setLoading(false)
}

  return (
    <div style={s.formWrap}>
      {error && <div style={s.alertError}> {error}</div>}
      {exito && <div style={s.alertExito}> ¡Solicitud enviada! Será revisada por el equipo CiviNet.</div>}

      {/* Nombre */}
      <label style={s.label}>Nombre de la fundación</label>
      <input style={s.input} placeholder="Ingrese nombre oficial de la fundacion" value={form.nombre} onChange={set('nombre')} />

      {/* NIT */}
      <label style={s.label}>NIT</label>
      <input style={s.input} placeholder="Digite el NIT de la fundacion" value={form.nit} onChange={set('nit')} />

      {/* Tipo */}
      <label style={s.label}>Tipo de fundación</label>
      <select style={s.select} value={form.tipo} onChange={set('tipo')}>
        <option value="">Selecciona el tipo</option>
        <option>Social/Comunitaria</option>
        <option>Rural</option>
        <option>Educativa</option>
        <option>Proteccion animal</option>
        <option>Salud</option>
        <option>ONG</option>
        <option>Otro</option>
      </select>

      {/* Dirección */}
      <label style={s.label}>Dirección</label>
      <input style={s.input} placeholder="Dirección de la sede principal" value={form.direccion} onChange={set('direccion')} />

      {/* Localidad */}
      <label style={s.label}>Localidad</label>
      <select style={s.select} value={form.localidad} onChange={set('localidad')}>
        <option value="">Seleccione la localidad</option>
        {LOCALIDADES.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      {/* Teléfono */}
      <label style={s.label}>Teléfono de contacto</label>
      <input style={s.input} placeholder="Digite numero de contacto" value={form.telefono} onChange={set('telefono')} />

      {/* Correo */}
      <label style={s.label}>Correo electrónico</label>
      <input style={s.input} type="email" placeholder="contacto@fundacion.com" value={form.correo} onChange={set('correo')} />

      {/* Contraseña */}
      <label style={s.label}>Contraseña</label>
      <input style={s.input} type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} />

      {/* Confirmar */}
      <label style={s.label}>Confirmar contraseña</label>
      <input style={s.input} type="password" placeholder="Confirme su contraseña" value={form.confirmar} onChange={set('confirmar')} />

      {/* Documentos */}
      <div style={s.docsSection}>
        <p style={s.docsTitle}>Documentos requeridos</p>

        {[
          { key: 'camaraComercio', label: 'Certificado de existencia y representación legal', sub: 'Emitido por la Cámara de Comercio', accept: '.pdf' },
          { key: 'rut',            label: 'Registro Único Tributario – RUT',                  sub: 'Emitido por la DIAN',              accept: '.pdf' },
          { key: 'cedulaRep',      label: 'Copia de la cédula del representante legal',       sub: 'Ambas caras del documento',        accept: '.pdf' },
          { key: 'estatutos',      label: 'Estatutos de la fundación',                        sub: 'Documento en formato PDF',         accept: '.pdf' },
        ].map(doc => (
          <div key={doc.key} style={s.docItem}>
            <div>
              <p style={s.docLabel}>{doc.label}</p>
              <p style={s.docSub}>{doc.sub}</p>
            </div>
            <label style={{
              ...s.docBtn,
              background: docs[doc.key] ? '#dcfce7' : '#f0fdfa',
              borderColor: docs[doc.key] ? '#16a34a' : '#0aa5a0',
              color: docs[doc.key] ? '#15803d' : '#0aa5a0'
            }}>
              {docs[doc.key] ? ` ${docs[doc.key].name.slice(0, 18)}…` : ' Adjuntar'}
              <input type="file" accept={doc.accept} onChange={setDoc(doc.key)} style={{ display: 'none' }} />
            </label>
          </div>
        ))}
      </div>

      {/* Términos */}
      <div style={s.terminosRow}>
        <input type="checkbox" id="terminosFund" checked={form.terminos} onChange={set('terminos')}
          style={{ marginRight: '0.5rem', accentColor: '#0aa5a0' }} />
        <label htmlFor="terminosFund" style={s.terminosLabel}>
          Acepto los términos y condiciones de CiviNet
        </label>
      </div>

      <button style={{ ...s.btnPrimario, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
        {loading ? 'Enviando solicitud…' : 'Registrar fundación'}
      </button>

      <p style={s.switchText}>
        ¿Ya tienes cuenta?{' '}
        <span style={s.link} onClick={() => setPage('login')}>Inicia sesión</span>
      </p>
    </div>
  )
}

// ── PÁGINA PRINCIPAL ──────────────────────────────────────
export default function Registro({ setPage, onLogin }) {
  const [tab, setTab] = useState('usuario') // 'usuario' | 'fundacion'

  return (
    <div style={s.bg}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>CiviNet</div>
        <h2 style={s.titulo}>Crear cuenta</h2>
        <p style={s.subtitulo}>Selecciona el tipo de cuenta que deseas crear</p>

        {/* Tabs */}
        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(tab === 'usuario' ? s.tabActive : s.tabInactive) }}
            onClick={() => setTab('usuario')}
          >
             Usuario
          </button>
          <button
            style={{ ...s.tab, ...(tab === 'fundacion' ? s.tabActive : s.tabInactive) }}
            onClick={() => setTab('fundacion')}
          >
             Fundación
          </button>
        </div>

        {/* Formulario activo */}
        {tab === 'usuario'
          ? <FormUsuario setPage={setPage} onLogin={onLogin} />
          : <FormFundacion setPage={setPage} />
        }
      </div>
    </div>
  )
}

// ── ESTILOS ───────────────────────────────────────────────
const s = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0f7f6 0%, #f0f9ff 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem', fontFamily: "'DM Sans', sans-serif"
  },
  card: {
    background: '#fff', borderRadius: '20px', padding: '2.5rem 2rem',
    width: '100%', maxWidth: '460px',
    boxShadow: '0 8px 40px rgba(10,165,160,0.12)',
    border: '1px solid rgba(10,165,160,0.15)'
  },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#0aa5a0', marginBottom: '0.6rem', fontWeight: 700 },
  titulo: { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' },
  subtitulo: { fontSize: '0.88rem', color: '#64748b', marginBottom: '1.4rem' },

  // Tabs
  tabs: { display: 'flex', borderRadius: '12px', overflow: 'hidden', border: '2px solid #0aa5a0', marginBottom: '1.6rem' },
  tab: { flex: 1, padding: '0.65rem', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' },
  tabActive:  { background: '#0aa5a0', color: '#fff' },
  tabInactive:{ background: '#fff', color: '#0aa5a0' },

  // Formulario
  formWrap: { display: 'flex', flexDirection: 'column' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#0f172a' },
  select: { width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#0f172a', background: '#fff', cursor: 'pointer' },
  radioGroup: { display: 'flex', gap: '1.5rem', marginBottom: '1rem', alignItems: 'center' },
  radioLabel: { display: 'flex', alignItems: 'center', fontSize: '0.92rem', color: '#334155', cursor: 'pointer', fontWeight: 500 },

  // Documentos
  docsSection: { background: '#f0fdfa', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid rgba(10,165,160,0.2)' },
  docsTitle: { fontWeight: 700, color: '#077a76', fontSize: '0.92rem', marginBottom: '0.8rem' },
  docItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', gap: '0.5rem' },
  docLabel: { fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.15rem' },
  docSub: { fontSize: '0.75rem', color: '#64748b' },
  docBtn: { padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1.5px solid', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'inherit' },

  // Botón y extras
  terminosRow: { display: 'flex', alignItems: 'center', marginBottom: '1.2rem' },
  terminosLabel: { fontSize: '0.85rem', color: '#475569', cursor: 'pointer' },
  btnPrimario: { width: '100%', padding: '0.8rem', background: '#0aa5a0', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: '1rem', fontFamily: 'inherit' },
  switchText: { textAlign: 'center', fontSize: '0.88rem', color: '#64748b' },
  link: { color: '#0aa5a0', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' },
  alertError: { background: '#fee2e2', color: '#b91c1c', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '1rem' },
  alertExito: { background: '#dcfce7', color: '#15803d', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '1rem' },
}
