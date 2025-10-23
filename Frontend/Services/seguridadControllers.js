const { registrarEventoSeguridad } = require('../services/seguridadService');

exports.loginFallido = (req, res, next) => {
  const { email } = req.body;
  registrarEventoSeguridad('Intento de acceso fallido', `Email: ${email}`);
  res.status(401).json({ message: 'Acceso no autorizado' });
};

exports.atencionError = (error) => {
  registrarEventoSeguridad('Error en aplicación', error.message);
};
