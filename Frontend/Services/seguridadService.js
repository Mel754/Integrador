npm install winston

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log', level: 'info' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Función para registrar eventos de seguridad
exports.registrarEventoSeguridad = (tipo, detalle) => {
  logger.log({
    level: 'info',
    message: `Tipo: ${tipo}, Detalles: ${detalle}`
  });
};
