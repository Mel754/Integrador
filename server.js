require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const permissionsRoutes = require('./routes/permissions');
const postulacionesRoutes = require('./routes/postulaciones');
const securityRoutes = require('./routes/security');
const proyectosRoutes = require('./routes/proyectos');

app.use('/api/auth', authRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/proyectos', proyectosRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de J&C Automatic Robotic',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      permissions: '/api/permissions',
      postulaciones: '/api/postulaciones',
      security: '/api/security',
      proyectos: '/api/proyectos'
    }
  });
});

app.get('/api/salud', (req, res) => {
  res.status(200).json({
    status: 'OK',
    mensaje: 'Servidor funcionando correctamente',
    timestamp: new Date()
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error desconocido'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`

  🚀 J&C Automatic Robotic API         
  Servidor ejecutándose en puerto ${PORT}    
  URL: http://tgi-ptu.bucaramanga.upb.edu.co:${PORT}

  `);
});
