const express           = require("express");
const cors              = require("cors");
const feedRoutes        = require("./routes/feedRoutes");
const authRoutes        = require("./routes/authRoutes");
const fundacionesRoutes = require("./routes/fundacionesRoutes");
const imagenesRoutes    = require("./routes/imagenesRoutes");
const usuariosRoutes    = require("./routes/usuariosRoutes");
 
const app = express();
 
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
 
app.use(express.json());
 
// Rutas civinet-feed
app.use("/api", feedRoutes);
 
// Rutas civinet-registro
app.use("/api/auth",        authRoutes);
app.use("/api/fundaciones", fundacionesRoutes);
app.use("/api/imagenes",    imagenesRoutes);
app.use("/api/usuarios",    usuariosRoutes);
 
module.exports = app;