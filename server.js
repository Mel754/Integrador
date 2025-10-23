require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlInjectionGuard = require('./middleware/sql-injection-guard');
const { auditMiddleware } = require('./middleware/audit-logger'); 
const { logger } = require('./utils/logger'); 

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sqlInjectionGuard);
app.use((err, req, res, next) => {
  require('./controllers/seguridadController').atencionError(err);
  res.status(500).json({ message: 'Error del servidor' });
});
app.use(auditMiddleware);

const authRoutes = require('./routes/auth');
const permissionsRoutes = require('./routes/permissions');
const postulacionesRoutes = require('./routes/postulaciones');
const securityRoutes = require('./routes/security');
const proyectosRoutes = require('./routes/proyectos');
const auditRoutes = require('./routes/audit'); 

app.use('/api/auth', authRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/actas', require('./routes/actas'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/audit', auditRoutes); 

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de J&C Automatic Robotic',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      permissions: '/api/permissions',
      postulaciones: '/api/postulaciones',
      security: '/api/security',
      proyectos: '/api/proyectos',
      audit: '/api/audit' 
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
  logger.error('Error del servidor:', err); 
  res.status(500).json({
    success: false,
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error desconocido'
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    mensaje: 'Ruta no encontrada'
  });
});

app.enable('trust proxy');

app.use((req, res, next) => {
  if (req.secure) return next();
  return res.redirect(`https://${req.headers.host}${req.url}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor iniciado en puerto ${PORT}`); 
  console.log(`
  🚀 J&C Automatic Robotic API         
  🔒 Protección SQL Injection activada
  📋 Sistema de auditoría activado
  Servidor ejecutándose en puerto ${PORT}    
  URL: http://tgi-ptu.bucaramanga.upb.edu.co:${PORT}
  `);
});
