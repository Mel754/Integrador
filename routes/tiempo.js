const express = require("express");
const router = express.Router();

let usuarios = [];
let reportes = [];

router.post("/usuario", (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

  const nuevoUsuario = { id: usuarios.length + 1, nombre };
  usuarios.push(nuevoUsuario);

  res.json({ message: "Usuario registrado ✅", usuario: nuevoUsuario });
});

router.post("/reporte", (req, res) => {
  const { usuarioId, actividad, horas } = req.body;

  if (!usuarioId || !actividad || !horas) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const usuario = usuarios.find(u => u.id === usuarioId);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  const nuevoReporte = {
    id: reportes.length + 1,
    usuarioId,
    actividad,
    horas,
    fecha: new Date().toISOString().split("T")[0], 
  };

  reportes.push(nuevoReporte);

  res.json({ message: "Tiempo registrado ✅", reporte: nuevoReporte });
});


router.get("/total/:usuarioId", (req, res) => {
  const { usuarioId } = req.params;
  const total = reportes
    .filter(r => r.usuarioId == usuarioId)
    .reduce((acc, r) => acc + r.horas, 0);

  res.json({ usuarioId, totalHoras: total });
});


router.get("/resumen", (req, res) => {
  const resumen = {};

  reportes.forEach(r => {
    if (!resumen[r.actividad]) {
      resumen[r.actividad] = 0;
    }
    resumen[r.actividad] += r.horas;
  });

  res.json({ resumen });
});


router.get("/reportes", (req, res) => {
  res.json(reportes);
});

module.exports = router;
