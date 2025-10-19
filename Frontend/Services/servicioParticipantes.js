
const pool = require('../db'); 

const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
function limpio(str = '') { return String(str || '').trim(); }
function correoValido(s) { return emailRe.test(String(s || '')); }

function armarParticipante(nombre, email, rol='participante') {
  const n = limpio(nombre);
  const e = limpio(email);
  if (!correoValido(e)) return null;
  return { nombre: n || e, email: e, rol };
}

function participantesDesdeProyecto(body = {}) {
  const out = [];
  const p1 = armarParticipante(body.nombreSolicitante, body.emailSolicitante, 'solicitante');
  if (p1) out.push(p1);

  const p2 = armarParticipante(body.contactoNombre, body.contactoEmail, 'contacto');
  if (p2) out.push(p2);

  if (body.correosAdicionales) {
    String(body.correosAdicionales).split(',')
      .map(x => x.trim())
      .forEach(c => {
        const p = armarParticipante('', c, 'invitado');
        if (p) out.push(p);
      });
  }
 
  const seen = new Set();
  return out.filter(p => (seen.has(p.email) ? false : (seen.add(p.email), true)));
}

function participantesDesdeProveedor(body = {}) {
  const out = [];
  const p = armarParticipante(body.nombreProveedor, body.emailProveedor, 'proveedor');
  if (p) out.push(p);
  const seen = new Set();
  return out.filter(x => (seen.has(x.email) ? false : (seen.add(x.email), true)));
}

async function registrarEnProyecto(projectId, participantes = []) {
  if (!projectId || !participantes.length) return;
  const values = participantes.map(p => [projectId, p.nombre, p.email, p.rol || 'participante']);
  await pool.query(
    'INSERT INTO project_participants (project_id, nombre, email, rol) VALUES ?',
    [values]
  );
}

async function crearReunionYAgregar({ titulo, descripcion='', inicio, fin, lugar='', creadoPor=null, participantes=[] }) {
  if (!inicio || !fin || !titulo) return null;

  const [r] = await pool.query(
    'INSERT INTO meetings (titulo, descripcion, fecha_inicio, fecha_fin, lugar, creado_por) VALUES (?,?,?,?,?,?)',
    [titulo, descripcion, inicio, fin, lugar, creadoPor]
  );
  const meetingId = r.insertId;

  if (participantes.length) {
    const values = participantes.map(p => [meetingId, p.nombre, p.email, p.rol || 'participante']);
    await pool.query(
      'INSERT INTO meeting_participants (meeting_id, nombre, email, rol) VALUES ?',
      [values]
    );
  }
  return meetingId;
}

module.exports = {
  participantesDesdeProyecto,
  participantesDesdeProveedor,
  registrarEnProyecto,
  crearReunionYAgregar
};
