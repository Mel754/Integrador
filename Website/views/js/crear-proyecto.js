// URL base de la API
const API_BASE_URL = 'http://tgi-ptu.bucaramanga.upb.edu.co:3000/api';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  const formulario = document.getElementById('formularioProyecto');
  
  // Agregar evento de envío del formulario
  formulario.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const datosProyecto = {
      nombreProyecto: document.getElementById('nombreProyecto').value,
      descripcionProyecto: document.getElementById('descripcionProyecto').value,
      sector: document.getElementById('sector').value,
      estado: document.getElementById('estado').value,
      presupuesto: parseInt(document.getElementById('presupuesto').value),
      plazo: parseInt(document.getElementById('plazo').value),
      tecnologias: document.getElementById('tecnologias').value,
      objetivos: document.getElementById('objetivos').value,
      nombreSolicitante: document.getElementById('nombreSolicitante').value,
      emailSolicitante: document.getElementById('emailSolicitante').value,
      telefonoSolicitante: document.getElementById('telefonoSolicitante').value,
      empresa: document.getElementById('empresa').value,
      cargo: document.getElementById('cargo').value,
      departamento: document.getElementById('departamento').value
    };
    
    try {
      // Enviar datos a la API
      const response = await fetch(`${API_BASE_URL}/proyectos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosProyecto)
      });
      
      const resultado = await response.json();
      
      if (resultado.success) {
        console.log('Proyecto enviado exitosamente:', resultado.data);
        mostrarModalExito();
        formulario.reset();
      } else {
        alert('Error: ' + resultado.mensaje);
      }
    } catch (error) {
      console.error('Error al enviar el proyecto:', error);
      alert('Error de conexión. Intenta más tarde.');
    }
  });
});

// Función para mostrar el modal de éxito
function mostrarModalExito() {
  const modal = document.getElementById('modalExito');
  modal.style.display = 'block';
  
  // Scroll hacia arriba para ver el modal
  window.scrollTo(0, 0);
}

// Función para cerrar el modal de éxito
function cerrarModalExito() {
  const modal = document.getElementById('modalExito');
  modal.style.display = 'none';
  
  // Redirigir a la página de proyectos después de cerrar
  setTimeout(function() {
    window.location.href = 'proyectos.html';
  }, 500);
}

// Cerrar modal al hacer click fuera del contenido
window.addEventListener('click', function(event) {
  const modal = document.getElementById('modalExito');
  if (event.target === modal) {
    cerrarModalExito();
  }
});