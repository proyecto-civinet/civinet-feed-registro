import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import Inicio   from "./pages2/Inicio";
import Registro from "./pages2/Registro";
import LoginReg from "./pages2/Login";

const CATEGORIAS = ["Todos", "Ayuda Social", "Educación", "Medio Ambiente", "Animales", "Deporte"];

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ mensaje, tipo, visible }) {
  if (!visible) return null;
  const colores = {
    exito:  { bg: '#2DBBC4', icon: '✓' },
    error:  { bg: '#e74c3c', icon: '✕' },
    info:   { bg: '#555',    icon: 'ℹ' },
  };
  const c = colores[tipo] || colores.info;
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
      background: c.bg, color: 'white', padding: '0.8rem 1.5rem',
      borderRadius: '30px', fontWeight: 600, fontSize: '0.95rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      animation: 'fadeInUp 0.3s ease',
      whiteSpace: 'nowrap'
    }}>
      <span style={{ fontSize: '1.1rem' }}>{c.icon}</span>
      {mensaje}
    </div>
  );
}

function NavbarRegistro({ setPage, usuario, onLogout }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: '60px',
      background: 'linear-gradient(135deg, #2DBBC4, #1a9aa3)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 1000
    }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={() => setPage('inicio')}>CiviNet</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#e0f7f6', fontSize: '0.95rem', cursor: 'pointer' }} onClick={() => setPage('inicio')}>Inicio</span>
        <span style={{ color: '#e0f7f6', fontSize: '0.95rem', cursor: 'pointer' }}>Donar</span>
        {usuario ? (
          <>
            <span style={{ color: '#e0f7f6', fontSize: '0.95rem', fontWeight: 600 }}>{usuario.nombre?.split(' ')[0]}</span>
            <button style={{ padding: '0.4rem 1.1rem', background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }} onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <button style={{ padding: '0.4rem 1.1rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setPage('registro')}>Registrarse</button>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #2DBBC4, #1a9aa3)', padding: '1.8rem 2rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '0.4rem' }}>
        <a href="#" style={{ color: 'white', margin: '0 0.5rem', fontSize: '0.88rem', textDecoration: 'none' }}>proyectocivinet@gmail.com</a>
      </div>
      <p style={{ color: 'white', fontSize: '0.82rem', marginTop: '0.4rem' }}>© 2026 CiviNet · Tu ayuda, su esperanza.</p>
    </footer>
  );
}

function CardCarrusel({ pub, onSelect, onLike, likesDados, onToggleComentarios, comentariosAbiertos, comentarios, onComentarChange, onComentar }) {
  const [imgIndex, setImgIndex] = useState(0);
  const imagenes = pub.imagenes && pub.imagenes.length > 0 ? pub.imagenes : [pub.imagen_url].filter(Boolean);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const intervalo = setInterval(() => setImgIndex(prev => (prev + 1) % imagenes.length), 3000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  return (
    <div className="card">
      <div className="card-img-wrapper">
        {imagenes.length > 0 ? <img src={imagenes[imgIndex]} alt={pub.titulo} /> : <div className="card-placeholder"></div>}
        {imagenes.length > 1 && (
          <div className="card-img-dots">
            {imagenes.map((_, i) => <span key={i} className={`card-img-dot ${i === imgIndex ? "activo" : ""}`} onClick={(e) => { e.stopPropagation(); setImgIndex(i); }} />)}
          </div>
        )}
      </div>
      <div className="card-body">
        <h3>{pub.ong_nombre}</h3>
        <div className="card-autor">{pub.titulo}</div>
        <div className="card-direccion">{pub.descripcion?.substring(0, 50)}...</div>
        <div className="barra-container">
          <div className={`barra ${Number(pub.porcentaje) >= 50 ? "alta" : "baja"}`} style={{ width: `${pub.porcentaje}%` }}></div>
        </div>
        <div className={`meta-texto ${Number(pub.porcentaje) >= 50 ? "alta" : "baja"}`}>{pub.porcentaje}% recaudado</div>
        <div className="card-footer">
          <button className="btn-conoce" onClick={() => onSelect(pub)}>Conoce más →</button>
          <div className="likes">
            <button onClick={() => onLike(pub.id)} className={likesDados.includes(pub.id) ? "liked" : ""}>
              {likesDados.includes(pub.id) ? "❤️" : "🤍"}
            </button>
            {pub.total_likes}
          </div>
        </div>
        <div className="comentarios-toggle" onClick={() => onToggleComentarios(pub.id)}>
          💬 {pub.total_comentarios} comentarios {comentariosAbiertos.includes(pub.id) ? "▲" : "▼"}
        </div>
        {comentariosAbiertos.includes(pub.id) && (
          <div className="comentar-seccion">
            <input type="text" placeholder="Escribe un comentario..." value={comentarios[pub.id] || ""} onChange={(e) => onComentarChange(pub.id, e.target.value)} />
            <button onClick={() => onComentar(pub.id)}>Publicar</button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetalleCarrusel({ imagenes, titulo }) {
  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => {
    if (imagenes.length <= 1) return;
    const intervalo = setInterval(() => setImgIndex(prev => (prev + 1) % imagenes.length), 3000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);
  return (
    <div style={{ position: "relative" }}>
      <img src={imagenes[imgIndex]} alt={titulo} className="detalle-img" />
      {imagenes.length > 1 && (
        <div className="card-img-dots" style={{ bottom: "12px" }}>
          {imagenes.map((_, i) => <span key={i} className={`card-img-dot ${i === imgIndex ? "activo" : ""}`} onClick={() => setImgIndex(i)} />)}
        </div>
      )}
    </div>
  );
}

function App() {
  const [usuario, setUsuario]                                 = useState(null);
  const [pagina, setPagina]                                   = useState("inicio");
  const [publicaciones, setPublicaciones]                     = useState([]);
  const [busqueda, setBusqueda]                               = useState("");
  const [menuAbierto, setMenuAbierto]                         = useState(false);
  const [perfilAbierto, setPerfilAbierto]                     = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [comentarios, setComentarios]                         = useState({});
  const [comentariosAbiertos, setComentariosAbiertos]         = useState([]);
  const [likesDados, setLikesDados]                           = useState([]);
  const [comentariosDetalle, setComentariosDetalle]           = useState([]);
  const [categoriaActiva, setCategoriaActiva]                 = useState("Todos");
  const [modalDonar, setModalDonar]                           = useState(false);
  const [montoDonar, setMontoDonar]                           = useState('');
  const [toast, setToast]                                     = useState({ visible: false, mensaje: '', tipo: 'exito' });
  const perfilRef = useRef(null);

  const mostrarToast = (mensaje, tipo = 'exito') => {
    setToast({ visible: true, mensaje, tipo });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  useEffect(() => {
    const guardado = localStorage.getItem('civinet_usuario');
    if (guardado) { try { setUsuario(JSON.parse(guardado)); setPagina("feed"); } catch {} }
  }, []);

  useEffect(() => {
    const handleClickFuera = (e) => { if (perfilRef.current && !perfilRef.current.contains(e.target)) setPerfilAbierto(false); };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  useEffect(() => { obtenerFeed(); }, []);
  useEffect(() => { if (publicacionSeleccionada) obtenerComentarios(publicacionSeleccionada.id); }, [publicacionSeleccionada]);

  const obtenerFeed = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/feed?limite=100");
      const data = await res.json();
      if (Array.isArray(data)) setPublicaciones(data);
      else if (data.publicaciones) setPublicaciones(data.publicaciones);
      else setPublicaciones([]);
    } catch (error) { console.error("Error al obtener feed:", error); }
  };

  const obtenerComentarios = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/feed/${id}/comentarios`);
      const data = await res.json();
      setComentariosDetalle(data.comentarios || []);
    } catch (error) { console.error("Error al obtener comentarios:", error); }
  };

  const darLike = async (id) => {
    if (likesDados.includes(id)) {
      setLikesDados(likesDados.filter(l => l !== id));
      setPublicaciones(prev => prev.map(pub => pub.id === id ? { ...pub, total_likes: String(Number(pub.total_likes) - 1) } : pub));
      return;
    }
    try {
      await fetch(`http://localhost:4000/api/feed/${id}/like`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: 1 }) });
      setLikesDados([...likesDados, id]);
      setPublicaciones(prev => prev.map(pub => pub.id === id ? { ...pub, total_likes: String(Number(pub.total_likes) + 1) } : pub));
    } catch (error) { console.error("Error al dar like:", error); }
  };

  const toggleComentarios = (id) => {
    if (comentariosAbiertos.includes(id)) setComentariosAbiertos(comentariosAbiertos.filter(c => c !== id));
    else setComentariosAbiertos([...comentariosAbiertos, id]);
  };

  const comentar = async (id) => {
    const texto = comentarios[id];
    if (!texto) return;
    try {
      await fetch(`http://localhost:4000/api/feed/${id}/comentario`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: 1, comentario: texto }) });
      setComentarios({ ...comentarios, [id]: "" });
      setPublicaciones(prev => prev.map(pub => pub.id === id ? { ...pub, total_comentarios: String(Number(pub.total_comentarios) + 1) } : pub));
      obtenerComentarios(id);
    } catch (error) { console.error("Error al comentar:", error); }
  };

  const borrarComentario = async (publicacion_id, comentario_id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/comentario/${comentario_id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usuario_id: 1, publicacion_id }) });
      if (res.ok) {
        setComentariosDetalle(prev => prev.filter(c => c.id !== comentario_id));
        setPublicaciones(prev => prev.map(pub => pub.id === publicacion_id ? { ...pub, total_comentarios: String(Number(pub.total_comentarios) - 1) } : pub));
      }
    } catch (error) { console.error("Error al borrar comentario:", error); }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('civinet_token');
    localStorage.removeItem('civinet_usuario');
    setUsuario(null);
    setPerfilAbierto(false);
    setPagina("inicio");
  };

  const publicacionesFiltradas = publicaciones.filter((pub) => {
    const coincideBusqueda = pub.ong_nombre?.toLowerCase().includes(busqueda.toLowerCase()) || pub.titulo?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === "Todos" || pub.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  const iconosCategoria = { "Todos": "", "Ayuda Social": "", "Educación": "", "Medio Ambiente": "", "Animales": "", "Deporte": "" };

  if (!usuario && pagina === "inicio") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarRegistro setPage={setPagina} usuario={null} onLogout={cerrarSesion} />
        <div style={{ flex: 1 }}><Inicio setPage={setPagina} usuario={null} onLogout={cerrarSesion} /></div>
        <Footer />
      </div>
    );
  }

  if (!usuario && pagina === "registro") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarRegistro setPage={setPagina} usuario={null} onLogout={cerrarSesion} />
        <div style={{ flex: 1 }}><Registro setPage={setPagina} onLogin={(u) => { setUsuario(u); setPagina("feed"); }} /></div>
        <Footer />
      </div>
    );
  }

  if (!usuario && pagina === "login") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarRegistro setPage={setPagina} usuario={null} onLogout={cerrarSesion} />
        <div style={{ flex: 1 }}><LoginReg setPage={setPagina} onLogin={(u) => { setUsuario(u); setPagina("feed"); }} /></div>
        <Footer />
      </div>
    );
  }

  if (publicacionSeleccionada) {
    const pub = publicaciones.find(p => p.id === publicacionSeleccionada.id) || publicacionSeleccionada;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav className="navbar">
          <div className="navbar-logo">
            <img src="/logo2.jpeg" alt="CiviNet" style={{ height: "50px", objectFit: "contain", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ flex: 1 }}></div>
          <div className="navbar-search">
            <input type="text" placeholder="Busca ONG o publicacion..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "white", color: "#2DBBC4", fontWeight: "700", fontSize: "17px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", border: "2px solid rgba(255,255,255,0.6)", marginLeft: '1rem' }}>
            {usuario.nombre ? usuario.nombre[0].toUpperCase() : usuario.correo?.[0].toUpperCase()}
          </div>
        </nav>
        <div style={{ flex: 1 }}>
          <div className="detalle">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.5rem 0 1rem 0', flexWrap: 'wrap' }}>
              <span onClick={() => { setPublicacionSeleccionada(null); setComentariosDetalle([]); }} style={{ fontSize: '0.83rem', color: '#2DBBC4', cursor: 'pointer', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Inicio</span>
              <span style={{ color: '#bbb', fontSize: '0.83rem' }}>›</span>
              <span onClick={() => { setPublicacionSeleccionada(null); setComentariosDetalle([]); }} style={{ fontSize: '0.83rem', color: '#2DBBC4', cursor: 'pointer', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>Publicaciones</span>
              <span style={{ color: '#bbb', fontSize: '0.83rem' }}>›</span>
              <span style={{ fontSize: '0.83rem', color: '#888', fontWeight: 500 }}>{pub.titulo?.length > 30 ? pub.titulo.substring(0, 30) + '...' : pub.titulo}</span>
            </div>
            {(() => { const imgs = pub.imagenes && pub.imagenes.length > 0 ? pub.imagenes : [pub.imagen_url].filter(Boolean); return imgs.length > 0 ? <DetalleCarrusel imagenes={imgs} titulo={pub.titulo} /> : null; })()}
            <div className="detalle-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                {pub.categoria && <span style={{ background: '#e0f7f6', color: '#2DBBC4', fontWeight: 700, fontSize: '0.78rem', borderRadius: '20px', padding: '0.2rem 0.8rem', border: '1px solid #b2ebf2' }}>🏷️ {pub.categoria}</span>}
                {pub.fecha_creacion && <span style={{ fontSize: '0.78rem', color: '#999' }}>📅 {new Date(pub.fecha_creacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
              </div>
              <span className="ong-tag">{pub.ong_nombre}</span>
              <h2>{pub.titulo}</h2>
              <p>{pub.descripcion}</p>
              <div className="detalle-meta">
                <div className="barra-container">
                  <div className={`barra ${Number(pub.porcentaje) >= 50 ? "alta" : "baja"}`} style={{ width: `${pub.porcentaje}%` }}></div>
                </div>
                <span className={`meta-texto ${Number(pub.porcentaje) >= 50 ? "alta" : "baja"}`}>${Number(pub.monto_actual).toLocaleString()} de ${Number(pub.monto_objetivo).toLocaleString()} — {pub.porcentaje}%</span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', margin: '0.8rem 0', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2DBBC4' }}>{pub.porcentaje}%</div><div style={{ fontSize: '0.75rem', color: '#999' }}>Recaudado</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2DBBC4' }}>${Number(pub.monto_actual).toLocaleString()}</div><div style={{ fontSize: '0.75rem', color: '#999' }}>De ${Number(pub.monto_objetivo).toLocaleString()}</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2DBBC4' }}>{pub.total_likes}</div><div style={{ fontSize: '0.75rem', color: '#999' }}>Apoyos</div></div>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', margin: '1rem 0' }}>
                <button onClick={() => setModalDonar(true)} style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #2DBBC4, #1a9aa3)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>Donar</button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); mostrarToast('¡Enlace copiado al portapapeles!', 'info'); }} style={{ flex: 1, padding: '0.75rem', background: 'white', color: '#2DBBC4', border: '2px solid #2DBBC4', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>Compartir</button>
              </div>
              {modalDonar && (() => {
                const tipo = pub.tipo_donacion || 'otro';
                const config = {
                  monetaria:   { label: 'Donacion monetaria',     placeholder: '0',                       inputType: 'number', prefix: '$', sugerencias: ['5.000','10.000','20.000','50.000'], hint: 'Ingresa el monto en pesos' },
                  ropa:        { label: 'Donacion de ropa',        placeholder: 'Ej: 3 camisas talla M',   inputType: 'text',   prefix: '#', sugerencias: ['1 prenda','3 prendas','5 prendas','Bolsa completa'], hint: 'Describe que prendas vas a donar' },
                  comida:      { label: 'Donacion de alimentos',   placeholder: 'Ej: 2 kg de arroz',       inputType: 'text',   prefix: '#', sugerencias: ['Mercado pequeño','Mercado mediano','Solo no perecederos','Alimento para mascotas'], hint: 'Describe los alimentos que donaras' },
                  implementos: { label: 'Donacion de implementos', placeholder: 'Ej: 1 tablet Samsung',   inputType: 'text',   prefix: '#', sugerencias: ['1 unidad','2 unidades','5 unidades','Kit completo'], hint: 'Describe el implemento que donaras' },
                  otro:        { label: 'Hacer una donacion',      placeholder: 'Describe tu donacion...', inputType: 'text',   prefix: '#', sugerencias: ['Pequeña','Mediana','Grande','A convenir'], hint: 'Describe que deseas donar' },
                };
                const c = config[tipo] || config['otro'];
                return (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                    <div style={{ background: 'white', borderRadius: '18px', padding: '2rem', minWidth: '300px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 0.2rem', color: '#2DBBC4', fontSize: '1.15rem' }}>{c.label}</h3>
                      <p style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '0.3rem' }}>"{pub.titulo}"</p>
                      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>{c.hint}</p>
                      <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #2DBBC4', borderRadius: '12px', overflow: 'hidden', marginBottom: '0.8rem' }}>
                        <span style={{ padding: '0.6rem 0.8rem', background: '#e0f7f6', color: '#2DBBC4', fontWeight: 700 }}>{c.prefix}</span>
                        <input type={c.inputType} placeholder={c.placeholder} value={montoDonar} onChange={e => setMontoDonar(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '0.6rem 0.8rem', fontSize: '1rem', fontWeight: 600 }} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {c.sugerencias.map(s => (
                          <button key={s} onClick={() => setMontoDonar(tipo === 'monetaria' ? s.replace('.', '') : s)} style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', border: '1.5px solid #2DBBC4', background: montoDonar === (tipo === 'monetaria' ? s.replace('.', '') : s) ? '#2DBBC4' : 'white', color: montoDonar === (tipo === 'monetaria' ? s.replace('.', '') : s) ? 'white' : '#2DBBC4', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>{tipo === 'monetaria' ? `$${s}` : s}</button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button onClick={() => { setModalDonar(false); setMontoDonar(''); }} style={{ flex: 1, padding: '0.6rem', borderRadius: '25px', border: '2px solid #ccc', background: 'white', color: '#888', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
                        <button onClick={() => { if (!montoDonar) return mostrarToast('Por favor completa el campo', 'error'); mostrarToast(`¡Gracias por tu donación! ${tipo === 'monetaria' ? `Monto: $${Number(montoDonar).toLocaleString()}` : `Donación: ${montoDonar}`}`, 'exito'); setModalDonar(false); setMontoDonar(''); }} style={{ flex: 1, padding: '0.6rem', borderRadius: '25px', background: 'linear-gradient(135deg, #2DBBC4, #1a9aa3)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Donar</button>
                      </div>
                    </div>
                  </div>
                );
              })()}
              <div className="detalle-acciones">
                <button className={`btn-like ${likesDados.includes(pub.id) ? "liked" : ""}`} onClick={() => darLike(pub.id)}>{likesDados.includes(pub.id) ? "❤️" : "🤍"} {pub.total_likes} Me gusta</button>
                <span>💬 {pub.total_comentarios} comentarios</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#f8fefe', border: '2px solid #e0f7f6', borderRadius: '16px', padding: '0.6rem 0.8rem', margin: '0.8rem 0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #2DBBC4, #1a9aa3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                  {usuario?.nombre ? usuario.nombre[0].toUpperCase() : usuario?.correo?.[0].toUpperCase()}
                </div>
                <input type="text" placeholder="Escribe un comentario..." value={comentarios[pub.id] || ""} onChange={(e) => setComentarios({ ...comentarios, [pub.id]: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') comentar(pub.id); }} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#444' }} />
                <button onClick={() => comentar(pub.id)} style={{ padding: '0.4rem 1rem', borderRadius: '20px', background: 'linear-gradient(135deg, #2DBBC4, #1a9aa3)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Publicar</button>
              </div>
              <div className="lista-comentarios">
                {comentariosDetalle.length === 0 ? (
                  <p className="sin-comentarios">No hay comentarios aún. ¡Sé el primero!</p>
                ) : (
                  comentariosDetalle.map((c) => (
                    <div className="comentario-item" key={c.id}>
                      <div className="comentario-avatar">{c.nombre ? c.nombre[0].toUpperCase() : 'U'}</div>
                      <div className="comentario-contenido" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span className="comentario-usuario">{c.nombre || `Usuario ${c.usuario_id}`}</span>
                          {c.fecha_creacion && <span style={{ fontSize: '0.75rem', color: '#bbb' }}>{new Date(c.fecha_creacion).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                        </div>
                        <p className="comentario-texto">{c.comentario}</p>
                      </div>
                      {c.usuario_id === 1 && (
                        <button onClick={() => borrarComentario(pub.id, c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "16px", padding: "4px" }} onMouseEnter={e => e.currentTarget.style.color = "#e74c3c"} onMouseLeave={e => e.currentTarget.style.color = "#ccc"}>🗑️</button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Toast mensaje={toast.mensaje} tipo={toast.tipo} visible={toast.visible} />
      </div>
    );
  }

  // ── FEED PRINCIPAL ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/logo2.jpeg" alt="CiviNet" style={{ height: "50px", objectFit: "contain", mixBlendMode: "multiply" }} />
        </div>
        <div className="navbar-menu" onClick={() => setMenuAbierto(!menuAbierto)}>☰ Menu</div>
        <div style={{ flex: 1 }}></div>
        <div className="navbar-search">
          <input type="text" placeholder="Busca ONG o publicacion..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div ref={perfilRef} style={{ position: "relative", marginLeft: '1rem', flexShrink: 0 }}>
          <div
            onClick={() => setPerfilAbierto(!perfilAbierto)}
            style={{ width: "40px", height: "40px", borderRadius: "50%", background: "white", color: "#2DBBC4", fontWeight: "700", fontSize: "17px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", border: "2px solid rgba(255,255,255,0.6)", transition: "transform 0.15s ease", userSelect: "none" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {usuario.nombre ? usuario.nombre[0].toUpperCase() : usuario.correo?.[0].toUpperCase()}
          </div>
          {perfilAbierto && (
            <div style={{ position: "absolute", right: 0, top: "52px", background: "white", borderRadius: "14px", minWidth: "220px", boxShadow: "0 12px 32px rgba(0,0,0,0.15)", zIndex: 1000, overflow: "hidden" }}>
              <div style={{ padding: "16px", background: "linear-gradient(135deg, #2DBBC4, #1a9aa3)", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "white", color: "#2DBBC4", fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {usuario.nombre ? usuario.nombre[0].toUpperCase() : usuario.correo?.[0].toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", marginBottom: "2px" }}>Conectado como</div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" }}>{usuario.nombre || usuario.correo}</div>
                </div>
              </div>
              <div style={{ padding: "8px 0" }}>
                <div style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#444", display: "flex", alignItems: "center", gap: "10px" }} onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "white"}> Mi perfil</div>
                <div style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#444", display: "flex", alignItems: "center", gap: "10px" }} onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "white"}> Mis donaciones</div>
                <div style={{ height: "1px", background: "#f0f0f0", margin: "4px 0" }} />
                <div onClick={cerrarSesion} style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#e74c3c", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }} onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"} onMouseLeave={e => e.currentTarget.style.background = "white"}> Cerrar sesión</div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {menuAbierto && (
        <div onClick={() => setMenuAbierto(false)} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.45)' }} />
      )}

      <div style={{ position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh', background: 'white', boxShadow: menuAbierto ? '4px 0 20px rgba(0,0,0,0.15)' : 'none', transform: menuAbierto ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease', zIndex: 1001, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.2rem', borderBottom: '1px solid #eee' }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>¡Hola!</span>
          <span onClick={() => setMenuAbierto(false)} style={{ cursor: 'pointer', fontSize: '1rem', color: '#999', fontWeight: 700 }} onMouseEnter={e => e.currentTarget.style.color = '#333'} onMouseLeave={e => e.currentTarget.style.color = '#999'}>✕</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
          {['Inicio', 'Donaciones', 'ONGs', 'Voluntarios', 'Mi perfil', 'Mis donaciones'].map((label, i) => (
            <React.Fragment key={label}>
              <li
                onClick={() => {
                  setMenuAbierto(false);
                  if (label === 'Inicio') { setUsuario(null); setPagina('inicio'); localStorage.removeItem('civinet_token'); localStorage.removeItem('civinet_usuario'); }
                }}
                style={{ padding: '0.95rem 1.2rem', cursor: 'pointer', fontSize: '0.95rem', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f7f7f7'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>{label}</span>
                <span style={{ color: '#bbb', fontSize: '1rem' }}>›</span>
              </li>
              {i === 3 && <li style={{ height: '1px', background: '#eee', margin: '0.3rem 0' }} />}
            </React.Fragment>
          ))}
        </ul>
        <div style={{ borderTop: '1px solid #eee' }}>
          <div onClick={cerrarSesion} style={{ padding: '0.95rem 1.2rem', cursor: 'pointer', fontSize: '0.95rem', color: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span>Cerrar sesión</span>
            <span style={{ color: '#e74c3c', fontSize: '1rem' }}>›</span>
          </div>
        </div>
      </div>

      <div className="app">
        <div className="filtros">
          {CATEGORIAS.map((cat) => (
            <button key={cat} className={`filtro-btn ${categoriaActiva === cat ? "activo" : ""}`} onClick={() => setCategoriaActiva(cat)}>
              {iconosCategoria[cat]} {cat}
            </button>
          ))}
        </div>
        <h2 className="seccion-titulo">Publicaciones disponibles:</h2>
        <div className="feed">
          {publicacionesFiltradas.map((pub) => (
            <CardCarrusel key={pub.id} pub={pub} onSelect={setPublicacionSeleccionada} onLike={darLike} likesDados={likesDados} onToggleComentarios={toggleComentarios} comentariosAbiertos={comentariosAbiertos} comentarios={comentarios} onComentarChange={(id, value) => setComentarios({ ...comentarios, [id]: value })} onComentar={comentar} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;

