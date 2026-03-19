import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ── Importar páginas de civinet-registro ──────────────────────────────────────
import Inicio   from "./pages2/Inicio";
import Registro from "./pages2/Registro";
import LoginReg from "./pages2/Login";

const CATEGORIAS = ["Todos", "Ayuda Social", "Educación", "Medio Ambiente", "Animales", "Deporte"];

// ── NAVBAR de civinet-registro ────────────────────────────────────────────────
function NavbarRegistro({ setPage, usuario, onLogout }) {
  return (
    <nav style={nav.bar}>
      <span style={nav.logo} onClick={() => setPage('inicio')}>CiviNet</span>
      <div style={nav.links}>
        <span style={nav.link} onClick={() => setPage('inicio')}>Inicio</span>
        <span style={nav.link}>Donar</span>
        {usuario ? (
          <>
            <span style={nav.linkName}>{usuario.nombre?.split(' ')[0]}</span>
            <button style={nav.btnOutline} onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <button style={nav.btnSolid} onClick={() => setPage('registro')}>Registrarse</button>
          </>
        )}
      </div>
    </nav>
  )
}

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

const foot = {
  bar: { background: 'linear-gradient(135deg, #83CBFF 100%)', padding: '1.8rem 2rem', textAlign: 'center' },
  link: { color: 'rgb(255,255,255)', margin: '0 0.5rem', fontSize: '0.88rem', textDecoration: 'none' },
  text: { color: 'rgb(255,255,255)', fontSize: '0.82rem', marginTop: '0.4rem' }
}

// ── CARD CARRUSEL ─────────────────────────────────────────────────────────────
function CardCarrusel({ pub, onSelect, onLike, likesDados, onToggleComentarios, comentariosAbiertos, comentarios, onComentarChange, onComentar }) {
  const [imgIndex, setImgIndex] = useState(0);
  const imagenes = pub.imagenes && pub.imagenes.length > 0 ? pub.imagenes : [pub.imagen_url].filter(Boolean);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const intervalo = setInterval(() => {
      setImgIndex(prev => (prev + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  return (
    <div className="card">
      <div className="card-img-wrapper">
        {imagenes.length > 0 ? (
          <img src={imagenes[imgIndex]} alt={pub.titulo} />
        ) : (
          <div className="card-placeholder"></div>
        )}
        {imagenes.length > 1 && (
          <div className="card-img-dots">
            {imagenes.map((_, i) => (
              <span key={i} className={`card-img-dot ${i === imgIndex ? "activo" : ""}`} onClick={(e) => { e.stopPropagation(); setImgIndex(i); }} />
            ))}
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

// ── DETALLE CARRUSEL ──────────────────────────────────────────────────────────
function DetalleCarrusel({ imagenes, titulo }) {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const intervalo = setInterval(() => {
      setImgIndex(prev => (prev + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  return (
    <div style={{ position: "relative" }}>
      <img src={imagenes[imgIndex]} alt={titulo} className="detalle-img" />
      {imagenes.length > 1 && (
        <div className="card-img-dots" style={{ bottom: "12px" }}>
          {imagenes.map((_, i) => (
            <span key={i} className={`card-img-dot ${i === imgIndex ? "activo" : ""}`} onClick={() => setImgIndex(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
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
  const perfilRef = useRef(null);

  useEffect(() => {
    const guardado = localStorage.getItem('civinet_usuario');
    if (guardado) {
      try {
        setUsuario(JSON.parse(guardado));
        setPagina("feed");
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) {
        setPerfilAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  useEffect(() => { obtenerFeed(); }, []);

  useEffect(() => {
    if (publicacionSeleccionada) obtenerComentarios(publicacionSeleccionada.id);
  }, [publicacionSeleccionada]);

  const obtenerFeed = async () => {
    try {
      const res  = await fetch("http://localhost:4000/api/feed?limite=100");
      const data = await res.json();
      if (Array.isArray(data)) setPublicaciones(data);
      else if (data.publicaciones) setPublicaciones(data.publicaciones);
      else setPublicaciones([]);
    } catch (error) {
      console.error("Error al obtener feed:", error);
    }
  };

  const obtenerComentarios = async (id) => {
    try {
      const res  = await fetch(`http://localhost:4000/api/feed/${id}/comentarios`);
      const data = await res.json();
      setComentariosDetalle(data.comentarios || []);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const darLike = async (id) => {
    if (likesDados.includes(id)) {
      setLikesDados(likesDados.filter(l => l !== id));
      setPublicaciones(prev => prev.map(pub => pub.id === id ? { ...pub, total_likes: String(Number(pub.total_likes) - 1) } : pub));
      return;
    }
    try {
      await fetch(`http://localhost:4000/api/feed/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: 1 })
      });
      setLikesDados([...likesDados, id]);
      setPublicaciones(prev => prev.map(pub => pub.id === id ? { ...pub, total_likes: String(Number(pub.total_likes) + 1) } : pub));
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const toggleComentarios = (id) => {
    if (comentariosAbiertos.includes(id)) setComentariosAbiertos(comentariosAbiertos.filter(c => c !== id));
    else setComentariosAbiertos([...comentariosAbiertos, id]);
  };

  const handleComentarChange = (id, value) => {
    setComentarios({ ...comentarios, [id]: value });
  };

  const comentar = async (id) => {
    const texto = comentarios[id];
    if (!texto) return;
    try {
      await fetch(`http://localhost:4000/api/feed/${id}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: 1, comentario: texto })
      });
      setComentarios({ ...comentarios, [id]: "" });
      setPublicaciones(prev => prev.map(pub => pub.id === id ? { ...pub, total_comentarios: String(Number(pub.total_comentarios) + 1) } : pub));
      obtenerComentarios(id);
    } catch (error) {
      console.error("Error al comentar:", error);
    }
  };

  const borrarComentario = async (publicacion_id, comentario_id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/comentario/${comentario_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: 1, publicacion_id })
      });
      if (res.ok) {
        setComentariosDetalle(prev => prev.filter(c => c.id !== comentario_id));
        setPublicaciones(prev => prev.map(pub =>
          pub.id === publicacion_id
            ? { ...pub, total_comentarios: String(Number(pub.total_comentarios) - 1) }
            : pub
        ));
      }
    } catch (error) {
      console.error("Error al borrar comentario:", error);
    }
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

  const iconosCategoria = {
    "Todos": "", "Ayuda Social": "", "Educación": "",
    "Medio Ambiente": "", "Animales": "", "Deporte": ""
  };

  // ── LANDING ──────────────────────────────────────────────────────────────────
  if (!usuario && pagina === "inicio") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarRegistro setPage={setPagina} usuario={null} onLogout={cerrarSesion} />
        <div style={{ flex: 1 }}>
          <Inicio setPage={setPagina} usuario={null} onLogout={cerrarSesion} />
        </div>
        <Footer />
      </div>
    );
  }

  // ── REGISTRO ─────────────────────────────────────────────────────────────────
  if (!usuario && pagina === "registro") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarRegistro setPage={setPagina} usuario={null} onLogout={cerrarSesion} />
        <div style={{ flex: 1 }}>
          <Registro setPage={setPagina} onLogin={(u) => { setUsuario(u); setPagina("feed"); }} />
        </div>
        <Footer />
      </div>
    );
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  if (!usuario && pagina === "login") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavbarRegistro setPage={setPagina} usuario={null} onLogout={cerrarSesion} />
        <div style={{ flex: 1 }}>
          <LoginReg setPage={setPagina} onLogin={(u) => { setUsuario(u); setPagina("feed"); }} />
        </div>
        <Footer />
      </div>
    );
  }

  // ── DETALLE DE PUBLICACIÓN ───────────────────────────────────────────────────
  if (publicacionSeleccionada) {
    const pub = publicaciones.find(p => p.id === publicacionSeleccionada.id) || publicacionSeleccionada;
    return (
      <div className="detalle">
        <button className="btn-volver" onClick={() => { setPublicacionSeleccionada(null); setComentariosDetalle([]); }}>
          ← Volver
        </button>
        {(() => {
          const imgs = pub.imagenes && pub.imagenes.length > 0 ? pub.imagenes : [pub.imagen_url].filter(Boolean);
          return imgs.length > 0 ? <DetalleCarrusel imagenes={imgs} titulo={pub.titulo} /> : null;
        })()}
        <div className="detalle-body">
          <span className="ong-tag">{pub.ong_nombre}</span>
          <h2>{pub.titulo}</h2>
          <p>{pub.descripcion}</p>
          <div className="detalle-meta">
            <div className="barra-container">
              <div className={`barra ${Number(pub.porcentaje) >= 50 ? "alta" : "baja"}`} style={{ width: `${pub.porcentaje}%` }}></div>
            </div>
            <span className={`meta-texto ${Number(pub.porcentaje) >= 50 ? "alta" : "baja"}`}>
              ${Number(pub.monto_actual).toLocaleString()} de ${Number(pub.monto_objetivo).toLocaleString()} — {pub.porcentaje}%
            </span>
          </div>
          <div className="detalle-acciones">
            <button className={`btn-like ${likesDados.includes(pub.id) ? "liked" : ""}`} onClick={() => darLike(pub.id)}>
              {likesDados.includes(pub.id) ? "❤️" : "🤍"} {pub.total_likes} Me gusta
            </button>
            <span>💬 {pub.total_comentarios} comentarios</span>
          </div>
          <div className="detalle-comentar">
            <input type="text" placeholder="Escribe un comentario..." value={comentarios[pub.id] || ""} onChange={(e) => setComentarios({ ...comentarios, [pub.id]: e.target.value })} />
            <button onClick={() => comentar(pub.id)}>Publicar</button>
          </div>
          <div className="lista-comentarios">
            {comentariosDetalle.length === 0 ? (
              <p className="sin-comentarios">No hay comentarios aún. ¡Sé el primero!</p>
            ) : (
              comentariosDetalle.map((c) => (
                <div className="comentario-item" key={c.id}>
                  <div className="comentario-avatar">U</div>
                  <div className="comentario-contenido" style={{ flex: 1 }}>
                    <span className="comentario-usuario">Usuario {c.usuario_id}</span>
                    <p className="comentario-texto">{c.comentario}</p>
                  </div>
                  {c.usuario_id === 1 && (
                    <button
                      onClick={() => borrarComentario(pub.id, c.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "16px", padding: "4px" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#e74c3c"}
                      onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
                      title="Borrar comentario"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── FEED PRINCIPAL ───────────────────────────────────────────────────────────
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/logo2.jpeg" alt="CiviNet" style={{ height: "50px", objectFit: "contain", mixBlendMode: "multiply" }} />
        </div>
        <div className="navbar-menu" onClick={() => setMenuAbierto(!menuAbierto)}>☰ Menu</div>
        <div style={{ flex: 1 }}></div>
        <div className="navbar-search">
          <input type="text" placeholder="Busca ONG o publicacion..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        <div ref={perfilRef} style={{ position: "relative" }}>
          <div
            onClick={() => setPerfilAbierto(!perfilAbierto)}
            style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "white", color: "#2DBBC4", fontWeight: "700",
              fontSize: "17px", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              border: "2px solid rgba(255,255,255,0.6)",
              transition: "transform 0.15s ease", userSelect: "none"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {usuario.nombre ? usuario.nombre[0].toUpperCase() : usuario.correo?.[0].toUpperCase()}
          </div>

          {perfilAbierto && (
            <div style={{
              position: "absolute", right: 0, top: "52px",
              background: "white", borderRadius: "14px", minWidth: "220px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.15)", zIndex: 1000,
              overflow: "hidden"
            }}>
              <div style={{
                padding: "16px",
                background: "linear-gradient(135deg, #2DBBC4, #1a9aa3)",
                display: "flex", alignItems: "center", gap: "12px"
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "white", color: "#2DBBC4", fontWeight: "700",
                  fontSize: "16px", display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0
                }}>
                  {usuario.nombre ? usuario.nombre[0].toUpperCase() : usuario.correo?.[0].toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", marginBottom: "2px" }}>Conectado como</div>
                  <div style={{
                    fontSize: "13px", fontWeight: "600", color: "white",
                    whiteSpace: "nowrap", overflow: "hidden",
                    textOverflow: "ellipsis", maxWidth: "140px"
                  }}>
                    {usuario.nombre || usuario.correo}
                  </div>
                </div>
              </div>
              <div style={{ padding: "8px 0" }}>
                <div
                  style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#444", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                   Mi perfil
                </div>
                <div
                  style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#444", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                   Mis donaciones
                </div>
                <div style={{ height: "1px", background: "#f0f0f0", margin: "4px 0" }} />
                <div
                  onClick={cerrarSesion}
                  style={{ padding: "10px 16px", cursor: "pointer", fontSize: "14px", color: "#e74c3c", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                   Cerrar sesión
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {menuAbierto && (
        <div className="menu-desplegable">
          <ul>
            <li onClick={() => setMenuAbierto(false)}>Inicio</li>
            <li onClick={() => setMenuAbierto(false)}>Donaciones</li>
            <li onClick={() => setMenuAbierto(false)}>ONGs</li>
            <li onClick={() => setMenuAbierto(false)}>Voluntarios</li>
            <li onClick={() => { setMenuAbierto(false); setPagina("registro"); setUsuario(null); }}>Registrarse</li>
          </ul>
        </div>
      )}

      <div className="app">
        <div className="filtros">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              data-cat={cat}
              className={`filtro-btn ${categoriaActiva === cat ? "activo" : ""}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {iconosCategoria[cat]} {cat}
            </button>
          ))}
        </div>

        <h2 className="seccion-titulo">Publicaciones disponibles:</h2>
        <div className="feed">
          {publicacionesFiltradas.map((pub) => (
            <CardCarrusel
              key={pub.id}
              pub={pub}
              onSelect={setPublicacionSeleccionada}
              onLike={darLike}
              likesDados={likesDados}
              onToggleComentarios={toggleComentarios}
              comentariosAbiertos={comentariosAbiertos}
              comentarios={comentarios}
              onComentarChange={handleComentarChange}
              onComentar={comentar}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;