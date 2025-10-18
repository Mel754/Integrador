// Cargar convocatorias desde el API
async function cargarConvocatorias() {
  try {
    // Cambia esta URL por tu endpoint real del API
    const response = await fetch('http://tgi-ptu.bucaramanga.upb.edu.co:3000/');
    
    if (!response.ok) {
      throw new Error('Error al cargar convocatorias');
    }
    
    const convocatorias = await response.json();
    mostrarConvocatorias(convocatorias);
  } catch (error) {
    console.error('Error:', error);
    console.log('Esperando datos del API...');
  }
}

// Mostrar convocatorias en la página
function mostrarConvocatorias(convocatorias) {
  const container = document.querySelector('.convocatorias-container');
  
  if (convocatorias.length === 0) {
    container.innerHTML = '<p class="no-convocatorias">Actualmente no hay convocatorias disponibles.</p>';
    return;
  }
  
  let html = '';
  
  convocatorias.forEach(conv => {
    html += `
      <div class="convocatoria-item">
        <div class="convocatoria-header">
          <h3>${conv.titulo}</h3>
          <button class="btn-postular" onclick="abrirModal(${conv.id})">Postularse</button>
        </div>
        <p class="convocatoria-fecha">📅 ${conv.fecha || 'N/A'}</p>
        <p class="convocatoria-descripcion">${conv.descripcion || ''}</p>
        <div class="convocatoria-detalles">
          <span>Sector: ${conv.sector || 'N/A'}</span>
          <span>Presupuesto: ${conv.presupuesto || 'N/A'}</span>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Modal
const modal = document.getElementById("formModal");
const confirmacion = document.getElementById("confirmacion");
const form = document.getElementById("formPostulacion");

function abrirModal(convocatoriaId = null) {
  modal.style.display = "block";
  confirmacion.style.display = "none";
  form.style.display = "block";
  form.dataset.convocatoriaId = convocatoriaId || '';
}

function cerrarModal() {
  modal.style.display = "none";
}

function enviarFormulario(e) {
  e.preventDefault();
  
  const formData = new FormData(form);
  const convocatoriaId = form.dataset.convocatoriaId;
  
  console.log('Enviando postulación para convocatoria:', convocatoriaId);
  
  const numero = Math.floor(10000 + Math.random() * 90000);
  document.getElementById("numSeguimiento").innerText = `#${numero}`;
  form.style.display = "none";
  confirmacion.style.display = "block";
  form.reset();
}

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};
document.addEventListener('DOMContentLoaded', cargarConvocatorias);