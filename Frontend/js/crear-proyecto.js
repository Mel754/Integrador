const body = {
  
  nombreSolicitante: document.getElementById('nombreSolicitante')?.value,
  emailSolicitante: document.getElementById('emailSolicitante')?.value,
  contactoNombre: document.getElementById('contactoNombre')?.value,
  contactoEmail: document.getElementById('contactoEmail')?.value,
  autoReunion: document.getElementById('autoReunion').checked
};

const ri = document.getElementById('reunionInicio')?.value;
const rf = document.getElementById('reunionFin')?.value;
if (ri) body.reunionInicio = new Date(ri);
if (rf) body.reunionFin    = new Date(rf);

await fetch('/api/proyectos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
  body: JSON.stringify(body)
});
