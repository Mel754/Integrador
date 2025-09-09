// middleware/checkPermission.js
const { permissions } = require('../controllers/permissionscontroller');

function checkPermission(feature) {
  return (req, res, next) => {
    const userId = req.user?.id; // req.user debe llenarse en autenticación

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userPerms = permissions[userId] || {};
    const allowed = userPerms[feature];

    if (!allowed) {
      return res.status(403).json({ error: `Acceso denegado: ${feature} deshabilitado` });
    }

    next();
  };
}

module.exports = checkPermission;
