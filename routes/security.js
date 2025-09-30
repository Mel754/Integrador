
require('dotenv').config();
const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { sendMail } = require('../utils/mailer');   
let pool = null;
try {
  pool = require('../config/db');                  
} catch (e) {
  console.warn('⚠️ No se encontró /config/db.js. Se usará modo sin BD.');
}


const lastCountryByUserId = new Map();


router.post('/login-check', async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ error: 'userId y email son requeridos' });
    }

  
    const ip = requestIp.getClientIp(req) || req.ip || '';
    const geo = geoip.lookup(ip) || {};
    const currentCountry = geo.country || 'UNK';

    const lastCountry = lastCountryByUserId.get(userId);
    const isUnusual = lastCountry && lastCountry !== currentCountry;

    if (isUnusual) {
      const token = jwt.sign(
        { typ: 'pwd_reset', uid: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXP || '15m' }
      );

      const link = `${process.env.APP_URL}/security/change-password/${token}`;

      await sendMail({
        to: email,
        subject: 'Alerta de inicio de sesión inusual',
        html: `
          <p>Detectamos un inicio de sesión desde una ubicación inusual (${currentCountry}).</p>
          <p>Si <strong>NO</strong> fuiste tú, te recomendamos cambiar tu contraseña:</p>
          <p><a href="${link}" target="_blank">Cambiar contraseña ahora</a> (válido por poco tiempo)</p>
        `
      });

      lastCountryByUserId.set(userId, currentCountry);
      return res.json({ message: 'Alerta enviada al correo institucional', action: 'password_reset_sent' });
    }

    lastCountryByUserId.set(userId, currentCountry);
    return res.json({ message: 'Inicio de sesión normal', country: currentCountry });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error en login-check' });
  }
});


router.get('/change-password/:token', (req, res) => {
  const { token } = req.params;
  return res.send(`
    <!DOCTYPE html>
    <html lang="es"><head><meta charset="utf-8"><title>Cambiar contraseña</title></head>
    <body style="font-family: Arial; max-width: 480px; margin: 40px auto;">
      <h2>Cambiar contraseña</h2>
      <p>Ingresa tu nueva contraseña para continuar.</p>
      <form method="POST" action="/security/change-password/${token}">
        <input type="password" name="password" placeholder="Nueva contraseña" required style="padding:8px; width:100%;"/>
        <button type="submit" style="margin-top:10px; padding:8px 14px;">Actualizar</button>
      </form>
    </body></html>
  `);
});


router.post('/change-password/:token', express.urlencoded({ extended: true }), async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).send('La contraseña debe tener al menos 8 caracteres.');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.typ !== 'pwd_reset' || !payload.uid) {
      return res.status(400).send('Token inválido.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (pool) {
      try {

        await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, payload.uid]);
      } catch (dbErr) {
        console.error('DB update error:', dbErr);
      }
    }

    return res.send('Contraseña actualizada correctamente. Ya puedes cerrar esta pestaña.');
  } catch (e) {
    console.error(e);
    return res.status(400).send('Token inválido o expirado.');
  }
});

module.exports = router;
