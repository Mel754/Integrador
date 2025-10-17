// server.js
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔁 Proxy hacia la API REAL de la UPB
app.use(
  "/login",
  createProxyMiddleware({
    target: "http://tgi-ptu.bucaramanga.upb.edu.co:3000",
    changeOrigin: true,
  })
);

// ✅ RUTAS DE POSTULACIONES
app.post('/api/postulaciones', (req, res) => {
  try {
    const datos = req.body;
    
    console.log('📝 Postulación recibida:', datos);
    
    // Aquí puedes guardar en base de datos
    // await Postulacion.create(datos);
    
    res.json({ 
      id: Date.now(),
      mensaje: 'Postulación guardada exitosamente',
      datos: datos
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      mensaje: 'Error al procesar la postulación',
      error: error.message 
    });
  }
});

// Servir tu frontend (opcional)
app.use(express.static("Website/views"));

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
