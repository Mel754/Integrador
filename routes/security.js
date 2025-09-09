// routes/security.js
const express = require('express');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const bcrypt = require('bcryptjs');
const mailer = require('../utils/mailer');

let db;
try {
  db = require('../config/db'); 
} catch (e) {
  db = null;
}

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'clave';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const TOKEN_EXP = process.env.TOKEN_EXP || '15m';


const lastKnownLocation = {}; 


function getLocationFromReq(req) {
  const ipRaw = requestIp.getClientIp(req) || '';
  const ip = ipRaw.replace(/^::ffff:/, '');
  const geo = geoip.lookup(ip) || {};
  return {
    ip,
    country: geo.country || null,
    city: geo.city || null
  };
}


router.post('/detect-login', async (req, res) => {
  try {
    const { userId, email, location } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId es requerido' });

    let info;
    if (location && location.country) {
      info = { ip: null, country: location.country, city: location.city || null };
    } else {
      info = getLocationFromReq(req);
    }

    const previous = lastKnownLocation[userId];
    const suspicious = previous && previous.country && info.country && previous.country !== info.country;


    if (suspicious) {

      let targetEmail = email;
      if (!targetEmail && db) {
        try {
          const [rows] = await db.query('SELECT email FROM sysuser WHERE idsysuser = ?', [userId]);
          if (rows && rows[0] && rows[0].email) targetEmail = rows[0].email;
        } catch (err) {
          console.warn('No se pudo leer email de BD (o columna no existe).', err.message);
        }
      }

      if (targetEmail) {
        await sendSecurityAlert(targetEmail, userId, info);
      } else {
        console.warn('Alerta sospechosa pero no hay email para notificar. userId=', userId);
      }
    }


    lastKnownLocation[userId] = { country: info.country, ip: info.ip, city: info.city, date: new Date().toISOString() };


    res.json({ suspicious, previous: previous || null, current: lastKnownLocation[userId] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


async function sendSecurityAlert(toEmail, userId, info) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXP });
  const resetLinkFrontend = `${APP_URL}/reset-password?token=${token}`; 
  const resetEndpoint = `${APP_URL}/security/change-password/${token}`; 

  const html = `
    <h2>Alerta de seguridad: inicio de sesión inusual</h2>
    <p>Detectamos un inicio de sesión desde una ubicación distinta a la última conocida.</p>
    <ul>
      <li>Usuario: ${userId}</li>
      <li>País detectado: ${info.country || 'Desconocido'}</li>
      <li>IP: ${info.ip || 'Desconocida'}</li>
      <li>Fecha: ${new Date().toISOString()}</li>
    </ul>
    <p>Si no reconoces este inicio de sesión, cambia tu contraseña:</p>
    <p><a href="${resetLinkFrontend}">Cambiar contraseña (interfaz web)</a></p>
    <p>O usa el endpoint seguro (POST) para enviar la nueva contraseña:</p>
    <pre>POST ${resetEndpoint}  body: { "newPassword": "..." }</pre>
    <small>Enlace válido por ${TOKEN_EXP}.</small>
  `;

  await mailer.sendMail({
    to: toEmail,
    subject: '⚠️ Alerta de seguridad: inicio de sesión inusual',
    html
  });
}


router.post('/change-password/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ error: 'newPassword es requerido' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const userId = payload.userId;
    const hashed = await bcrypt.hash(newPassword, 10);

    if (db) {
      try {
        const [result] = await db.query('UPDATE sysuser SET password = ? WHERE idsysuser = ?', [hashed, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado en la BD' });
      } catch (err) {
        console.error('Error actualizando contraseña en BD:', err.message);
        return res.status(500).json({ error: 'Error al actualizar contraseña en la BD' });
      }
    } else {

      console.log(`Simulación: cambiar contraseña de user ${userId} a hash ${hashed}`);

    }

    return res.json({ message: 'Contraseña cambiada correctamente' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /security/validate-token/:token  -> validar token (útil para frontend)
 */
router.get('/validate-token/:token', (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(400).json({ valid: false, error: err.message });
  }
});

/**
 * GET /security/last-location/:userId  -> obtener última ubicación en memoria
 */
router.get('/last-location/:userId', (req, res) => {
  const { userId } = req.params;
  const last = lastKnownLocation[userId];
  if (!last) return res.status(404).json({ error: 'No hay ubicación registrada para este usuario' });
  res.json(last);
});

module.exports = router;
