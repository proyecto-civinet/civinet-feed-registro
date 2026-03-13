import React, { useState } from "react";
import supabase from "./supabaseClient";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [esRegistro, setEsRegistro] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    setCargando(true);
    setError("");
    try {
      let result;
      if (esRegistro) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }
      if (result.error) {
        setError(result.error.message);
      } else {
        onLogin(result.data.user);
      }
    } catch (e) {
      setError("Ocurrio un error, intenta de nuevo.");
    }
    setCargando(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f6f9" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
        <img src="/logo2.jpeg" alt="CiviNet" style={{ height: "60px", objectFit: "contain", mixBlendMode: "multiply", display: "block", margin: "0 auto 24px" }} />
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "24px" }}>
          {esRegistro ? "Crear cuenta" : "Iniciar sesion"}
        </h2>
        <input
          type="email"
          placeholder="Correo electronico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e0e0e0", marginBottom: "12px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
        />
        <input
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e0e0e0", marginBottom: "16px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
        />
        {error && <p style={{ color: "#e53935", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={cargando}
          style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #5bc8d4, #4ab8c8)", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginBottom: "12px" }}
        >
          {cargando ? "Cargando..." : esRegistro ? "Registrarme" : "Entrar"}
        </button>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#888" }}>
          {esRegistro ? "Ya tienes cuenta?" : "No tienes cuenta?"}{" "}
          <span onClick={() => setEsRegistro(!esRegistro)} style={{ color: "#5bc8d4", cursor: "pointer", fontWeight: "700" }}>
            {esRegistro ? "Inicia sesion" : "Registrate"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;