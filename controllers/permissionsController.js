
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/permissions.json');

// cargar los permisos
let permissions = {};
if (fs.existsSync(filePath)) {
  permissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Guardar cambios en el arc
function savePermissions() {
  fs.writeFileSync(filePath, JSON.stringify(permissions, null, 2));
}

// Obtener permisos desde la BD
function getUserPermissions(req, res) {
  const { userId } = req.params;
  const userPerms = permissions[userId] || {};
  res.json(userPerms);
}

// A/D permisos
function setUserPermission(req, res) {
  const { userId } = req.params;
  const { feature, enabled } = req.body;

  if (!feature) return res.status(400).json({ error: 'feature es requerido' });

  if (!permissions[userId]) {
    permissions[userId] = {};
  }
  permissions[userId][feature] = enabled ? true : false;

  savePermissions();

  res.json({ message: `Permiso ${feature} actualizado`, enabled });
}

module.exports = { getUserPermissions, setUserPermission, permissions };
