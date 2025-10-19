const dayjs = require('dayjs');
const pool = require('../db'); // tu pool MySQL
const { buildICS } = require('../services/icsService');

exports.createMeeting = async (req, res, next) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_fin, lugar, participantes=[] } = req.body;
    const [r] = await pool.query(
      'INSERT INTO meetings (titulo, descripcion, fecha_inicio, fecha_fin, lugar, creado_por) VALUES (?,?,?,?,?,?)',
      [titulo, descripcion, fecha_inicio, fecha_fin, lugar, req.user?.id || null]
    );
    const meetingId = r.insertId;

    for (const p of participantes) {
      await pool.query(
        'INSERT INTO meeting_participants (meeting_id, nombre, email, rol) VALUES (?,?,?,?)',
        [meetingId, p.nombre || '', p.email, p.rol || 'participante']
      );
    }
    res.status(201).json({ id: meetingId });
  } catch (e) { next(e); }
};

exports.listMeetings = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM meetings ORDER BY fecha_inicio DESC');
    res.json(rows);
  } catch (e) { next(e); }
};

exports.getICS = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[m]] = await pool.query('SELECT * FROM meetings WHERE id=?', [id]);
    if (!m) return res.status(404).json({ message: 'No encontrada' });

    const start = dayjs(m.fecha_inicio), end = dayjs(m.fecha_fin);
    const ics = await buildICS({
      title: m.titulo,
      description: m.descripcion || '',
      location: m.lugar || '',
      start, end
    });
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=meeting-${id}.ics`);
    res.send(ics);
  } catch (e) { next(e); }
};
