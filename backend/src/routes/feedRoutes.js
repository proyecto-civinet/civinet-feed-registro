const express = require("express");
const router  = express.Router();
const feedController = require("../controllers/feedController");
const upload = require("../middlewares/upload");
const { uploadImage } = require("../services/storageService");

// ── Feed ─────────────────────────────────────────────────────────
router.get("/feed",                                   feedController.obtenerFeed);
router.post("/feed",                                  feedController.crearPublicacion);

// ── Recaudaciones ────────────────────────────────────────────────
router.get("/feed/recaudaciones",                     feedController.obtenerRecaudaciones);

// ── Likes y comentarios ──────────────────────────────────────────
router.post("/feed/:id/like",                                      feedController.darLike);
router.delete("/comentario/:comid",                                 feedController.borrarComentario);
router.post("/feed/:id/comentario",                                 feedController.comentar);
router.get("/feed/:id/comentarios",                                 feedController.verComentarios);

// ── Suscripciones ────────────────────────────────────────────────
router.post("/feed/suscribir",                        feedController.suscribirse);
router.delete("/feed/suscribir",                      feedController.cancelarSuscripcion);

// ── Notificaciones ───────────────────────────────────────────────
router.get("/feed/notificaciones/:usuario_id",        feedController.obtenerNotificaciones);
router.patch("/feed/notificaciones/:notificacion_id/leer", feedController.marcarLeida);

// ── Imágenes ONGs (Cloudinary) ───────────────────────────────────
router.post("/ongs/imagen", upload.single("foto"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se envió ninguna imagen" });
    const url = await uploadImage(req.file.buffer, "ongs");
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: "Error subiendo imagen" });
  }
});

module.exports = router;