const pool = require('../db');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

exports.renderActaHtml = async (req, res, next) => {
  try {
    const { meeting_id } = req.params;
    const [[meeting]] = await pool.query('SELECT * FROM meetings WHERE id=?', [meeting_id]);
    if (!meeting) return res.status(404).json({ message: 'Meeting no encontrada' });

    const [participantes] = await pool.query('SELECT nombre, email, rol FROM meeting_participants WHERE meeting_id=?', [meeting_id]);

    const acta = {
      codigo: `ACTA-${meeting_id}`,
      agenda: req.body.agenda || ['Presentación','Estado del proyecto','Siguientes pasos'],
      acuerdos: req.body.acuerdos || []
    };

    const tpl = fs.readFileSync(path.join(__dirname,'../templates/acta.html'),'utf8');
    const html = ejs.render(tpl, { meeting, participantes, acta });
    res.type('html').send(html);
  } catch (e) { next(e); }

  const { htmlToPdf } = require('../services/pdfService');

exports.renderActaPdf = async (req, res, next) => {
  try {
   
    const html = ;
    const pdf = await htmlToPdf(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=acta.pdf');
    res.send(pdf);
  } catch (e) { next(e); }
};


for (const a of acta.acuerdos) {
  await pool.query(
    'INSERT INTO tareas (meeting_id, titulo, descripcion, responsable_email, fecha_vencimiento) VALUES (?,?,?,?,?)',
    [meeting_id, a.descripcion, a.descripcion, a.responsable, a.vencimiento]
  );
}

  
};
