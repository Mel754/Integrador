const pool = require('../db');

exports.metrics = async (req, res, next) => {
  try {
    const [[m1]] = await pool.query('SELECT COUNT(*) AS reuniones FROM meetings');
    const [[m2]] = await pool.query("SELECT COUNT(*) AS actas FROM tareas WHERE estado='hecha'"); // ejemplo
    const [[m3]] = await pool.query("SELECT SUM(estado='pendiente') as pendientes, SUM(estado='hecha') as hechas FROM tareas");
    res.json({
      reuniones: m1.reuniones,
      actas: m2.actas,
      tareas: { pendientes: m3.pendientes || 0, hechas: m3.hechas || 0 }
    });
  } catch (e) { next(e); }
};
