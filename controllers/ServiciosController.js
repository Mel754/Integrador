
const {
  participantesDesdeProveedor,
  crearReunionYAgregar
} = require('../services/servicioParticipantes');

const participantes = participantesDesdeProveedor(req.body);

if (req.body.autoReunion === true || req.body.autoReunion === 'true') {
  const ahora = new Date();
  const inicio = req.body.reunionInicio || new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()+1, 9, 0, 0);
  const fin    = req.body.reunionFin    || new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()+1, 10, 0, 0);

  await crearReunionYAgregar({
    titulo: `Contacto inicial con proveedor`,
    descripcion: req.body.descripcion || '',
    inicio,
    fin,
    lugar: req.body.lugar || 'Virtual',
    creadoPor: req.user?.id || null,
    participantes
  });
}
