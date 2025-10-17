// Base de datos de convocatorias con detalles
const detallesConvocatorias = {
  1: {
    titulo: "Convocatoria para desarrollo de soluciones de robótica industrial",
    fecha: "24 de julio de 2025",
    cierre: "17 de octubre de 2025",
    sector: "Robótica y Automatización",
    presupuesto: "$60.000.000 por proyecto",
    descripcion: "Invitación a empresas de ingeniería y startups a presentar proyectos de robótica industrial...",
    cadenas_priorizadas: "Automatización industrial, Robótica colaborativa, Sistemas de control, Logística automatizada",
    beneficios: [
      "Cofinanciación de hasta $60.000.000 por proyecto",
      "Acompañamiento técnico en implementación de soluciones de robótica",
      "Mentoría de expertos en automatización industrial",
      "Acceso a laboratorios y centros de innovación tecnológica"
    ],
    requisitos: [
      "Empresa legalmente constituida en el sector de automatización o robótica",
      "Experiencia demostrable en proyectos de robótica industrial",
      "Propuesta innovadora con plan de implementación",
      "Disponibilidad de equipo técnico especializado"
    ],
    nota_requisitos: "Las empresas deben cumplir con lo estipulado en los términos de referencia.",
    cronograma: [
      { evento: "Apertura de la convocatoria", fecha: "24 de julio de 2025" },
      { evento: "Solicitud de aclaraciones", fecha: "Hasta el 6 de octubre de 2025" },
      { evento: "Cierre de postulaciones", fecha: "17 de octubre de 2025" },
      { evento: "Evaluación técnica", fecha: "31 de octubre de 2025" },
      { evento: "Notificación de resultados", fecha: "10 de noviembre de 2025" }
    ],
    documentos: [
      "Términos de Referencia - Robótica Industrial",
      "Formato de propuesta técnica",
      "Plan de implementación",
      "Presupuesto detallado"
    ]
  },
  2: {
    titulo: "Convocatoria para implementación de sistemas de automatización inteligente",
    fecha: "15 de agosto de 2025",
    cierre: "30 de noviembre de 2025",
    sector: "Automatización y Control",
    presupuesto: "$50.000.000 por proyecto",
    descripcion: "Programa de cofinanciación para empresas que desarrollen sistemas de automatización inteligente...",
    cadenas_priorizadas: "Manufactura avanzada, Logística automatizada, Control de calidad",
    beneficios: [
      "Cofinanciación de hasta $50.000.000 por proyecto",
      "Capacitación en integración de sensores IoT",
      "Acompañamiento técnico especializado",
      "Acceso a laboratorios y soporte de expertos"
    ],
    requisitos: [
      "Empresa legalmente constituida",
      "Proyecto detallado con cronograma y presupuesto",
      "Experiencia en sistemas automatizados",
      "Contrapartida mínima del 40%"
    ],
    nota_requisitos: "El proyecto debe cumplir con todos los requerimientos técnicos.",
    cronograma: [
      { evento: "Apertura de convocatoria", fecha: "15 de agosto de 2025" },
      { evento: "Solicitud de aclaraciones", fecha: "Hasta el 15 de noviembre de 2025" },
      { evento: "Cierre de postulaciones", fecha: "30 de noviembre de 2025" },
      { evento: "Evaluación de proyectos", fecha: "15 de diciembre de 2025" },
      { evento: "Comunicación de resultados", fecha: "31 de diciembre de 2025" }
    ],
    documentos: [
      "Términos de Referencia",
      "Formato de propuesta técnica",
      "Plan de implementación",
      "Presupuesto detallado"
    ]
  }
};

// Variable para almacenar ID de convocatoria activa
let convocatoriaActual = null;

// Abrir modal con detalles
function abrirDetalles(id) {
  convocatoriaActual = id;
  const modal = document.getElementById('detallesModal');
  const contenido = document.getElementById('detallesContenido');
  const conv = detallesConvocatorias[id];
  
  if (conv) {
    let cronogramaHTML = '<table class="tabla-cronograma"><tbody>';
    conv.cronograma.forEach(item => {
      cronogramaHTML += `
        <tr>
          <td class="evento-col"><strong>${item.evento}</strong></td>
          <td class="fecha-col">${item.fecha}</td>
        </tr>
      `;
    });
    cronogramaHTML += '</tbody></table>';

    let documentosHTML = '<ul class="lista-documentos">';
    conv.documentos.forEach(doc => {
      documentosHTML += `<li><a href="#">${doc}</a></li>`;
    });
    documentosHTML += '</ul>';

    contenido.innerHTML = `
      <h2>${conv.titulo}</h2>
      
      <div class="detalle-seccion">
        <p class="descripcion-general">${conv.descripcion}</p>
      </div>

      <div class="detalle-seccion">
        <h3>Cadenas de Valor Priorizadas</h3>
        <p>${conv.cadenas_priorizadas}</p>
      </div>

      <div class="detalle-seccion">
        <h3>Beneficios</h3>
        <ul class="lista-beneficios">
          ${conv.beneficios.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>

      <div class="detalle-seccion">
        <h3>Requisitos para participar</h3>
        <ul class="lista-requisitos">
          ${conv.requisitos.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <div class="detalle-seccion">
        <h3>Cronograma</h3>
        ${cronogramaHTML}
      </div>

      <div class="detalle-seccion">
        <h3>Documentos</h3>
        ${documentosHTML}
      </div>

      <div class="acciones-modal">
        <button class="card-button" onclick="cerrarDetalles()">Cerrar</button>
        <button class="card-button" style="background-color: #fb923c;" onclick="abrirFormularioPostulacion()">Postularse</button>
      </div>
    `;
  }
  
  modal.style.display = 'block';
}

// Abrir formulario de postulación
function abrirFormularioPostulacion() {
  const modal = document.getElementById('detallesModal');
  const contenido = document.getElementById('detallesContenido');
  
  contenido.innerHTML = `
    <span class="close" onclick="cerrarDetalles()">&times;</span>
    <h2 style="color: #1e3a8a; margin-bottom: 30px;">Formulario de Postulación</h2>
    
    <div style="max-height: 70vh; overflow-y: auto; padding-right: 10px;">
      <!-- Campo 1: Política de Datos -->
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
        <label style="display: flex; gap: 10px; cursor: pointer;">
          <input type="checkbox" id="politicaDatos" style="width: 18px; height: 18px; cursor: pointer;">
          <span>
            <strong style="color: #1e3a8a;">POLÍTICA DE TRATAMIENTO Y PROTECCIÓN DE DATOS PERSONALES <span style="color: red;">*</span></strong>
            <p style="color: #666; margin-top: 5px; font-size: 0.9em;">Acepto el tratamiento de mis datos personales conforme a la política de privacidad</p>
          </span>
        </label>
      </div>

      <!-- Campo 2: Tipo de Identificación -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Tipo de identificación del proponente <span style="color: red;">*</span>
        </label>
        <select id="tipoIdentificacion" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;">
          <option value="">Seleccionar...</option>
          <option value="nit">NIT</option>
          <option value="cc">Cédula de Ciudadanía</option>
          <option value="ce">Cédula de Extranjería</option>
        </select>
      </div>

      <!-- Campo 3: Número de Identificación -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Número de identificación <span style="color: red;">*</span>
        </label>
        <input type="text" id="numeroIdentificacion" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;" placeholder="Ingrese el número">
      </div>

      <!-- Campo 4: Figura del Proponente -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Seleccione la figura del proponente <span style="color: red;">*</span>
        </label>
        <select id="figuraProponente" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;">
          <option value="">Seleccionar...</option>
          <option value="pyme">PYME</option>
          <option value="gran_empresa">Gran Empresa</option>
          <option value="entidad_publica">Entidad Pública</option>
          <option value="ong">ONG</option>
        </select>
      </div>

      <!-- Campo 5: Razón Social -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Razón social del proponente <span style="color: red;">*</span>
        </label>
        <input type="text" id="razonSocial" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;" placeholder="Nombre de la empresa">
      </div>

      <!-- Campo 6: Representante Legal -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Nombre del representante legal <span style="color: red;">*</span>
        </label>
        <input type="text" id="representanteLegal" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;">
      </div>

      <!-- Campo 7: Teléfono -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Teléfono de contacto <span style="color: red;">*</span>
        </label>
        <input type="tel" id="telefonoContacto" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;">
      </div>

      <!-- Campo 8: Email -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Correo electrónico de contacto <span style="color: red;">*</span>
        </label>
        <input type="email" id="emailContacto" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;">
      </div>

      <!-- Campo 9: Email Alterno -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Otro correo electrónico <span style="color: red;">*</span>
        </label>
        <input type="email" id="emailContacto2" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;">
      </div>

      <!-- Campo 10: Dirección -->
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 12px;">
          Dirección de la sede principal <span style="color: red;">*</span>
        </label>
        <input type="text" placeholder="Dirección" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; margin-bottom: 10px;">
        <input type="text" placeholder="Dirección línea 2 (opcional)" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; margin-bottom: 10px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <input type="text" placeholder="Ciudad/Pueblo" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins;">
          <input type="text" placeholder="Estado/Región" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins;">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <input type="text" placeholder="Código postal" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins;">
          <input type="text" placeholder="País" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins;">
        </div>
      </div>

      <!-- Campo 11: Cadena de Valor -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Cadena de valor priorizada <span style="color: red;">*</span>
        </label>
        <select style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em;">
          <option value="">Seleccionar...</option>
          <option value="cafe">Café de Santander</option>
          <option value="ganaderia">Ganadería</option>
          <option value="estudios">Estudios Clínicos</option>
          <option value="cacao">Cacao</option>
          <option value="energia">Energía</option>
          <option value="turismo">Turismo</option>
          <option value="metalmecanica">Metalmecánica</option>
          <option value="agroindustria">Agroindustria del Magdalena</option>
        </select>
      </div>

      <!-- Campo 21: Experiencia Digital -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 10px;">
          ¿Experiencia previa en transformación digital? <span style="color: red;">*</span>
        </label>
        <div>
          <label style="margin-right: 20px; cursor: pointer;">
            <input type="radio" name="experiencia" value="si"> Sí
          </label>
          <label style="cursor: pointer;">
            <input type="radio" name="experiencia" value="no"> No
          </label>
        </div>
      </div>

      <!-- Campo 23: Aliados -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Aliados de la alianza <span style="color: red;">*</span>
        </label>
        <textarea placeholder="Ingrese razón social/nombre de aliados, uno por línea" rows="4" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: Poppins; font-size: 0.95em; resize: vertical;"></textarea>
      </div>

      <!-- Carga de archivos -->
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Cédula del representante legal <span style="color: red;">*</span>
        </label>
        <input type="file" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Certificado de existencia (máximo 30 días)
        </label>
        <input type="file" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          RUT (Registro Único Tributario)
        </label>
        <input type="file" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">
          Anexo No. 2: Documento de propuesta <span style="color: red;">*</span>
        </label>
        <input type="file" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
      </div>
    </div>

    <div style="display: flex; gap: 10px; margin-top: 30px; justify-content: flex-end;">
      <button class="card-button" onclick="cerrarDetalles()" style="width: auto;">Cancelar</button>
      <button class="card-button" style="background-color: #fb923c; width: auto;" onclick="enviarFormulario()">Enviar Postulación</button>
    </div>
  `;
}

// Enviar formulario
async function enviarFormulario() {
  const politica = document.getElementById('politicaDatos').checked;
  const tipoId = document.getElementById('tipoIdentificacion').value;
  const numeroId = document.getElementById('numeroIdentificacion').value;
  const figura = document.getElementById('figuraProponente').value;
  const razonSocial = document.getElementById('razonSocial').value;
  const representante = document.getElementById('representanteLegal').value;
  const telefono = document.getElementById('telefonoContacto').value;
  const email = document.getElementById('emailContacto').value;
  const email2 = document.getElementById('emailContacto2').value;
  
  // Validar campos obligatorios
  if (!politica) {
    alert('❌ Debe aceptar la política de tratamiento de datos');
    return;
  }
  if (!tipoId) {
    alert('❌ Seleccione el tipo de identificación');
    return;
  }
  if (!numeroId.trim()) {
    alert('❌ Ingrese el número de identificación');
    return;
  }
  if (!figura) {
    alert('❌ Seleccione la figura del proponente');
    return;
  }
  if (!razonSocial.trim()) {
    alert('❌ Ingrese la razón social del proponente');
    return;
  }
  if (!representante.trim()) {
    alert('❌ Ingrese el nombre del representante legal');
    return;
  }
  if (!telefono.trim()) {
    alert('❌ Ingrese el teléfono de contacto');
    return;
  }
  if (!email.trim()) {
    alert('❌ Ingrese el correo electrónico');
    return;
  }
  if (!email2.trim()) {
    alert('❌ Ingrese el correo electrónico alterno');
    return;
  }
  
  // Preparar datos para enviar
  const datosFormulario = {
    politicaDatos: politica,
    tipoIdentificacion: tipoId,
    numeroIdentificacion: numeroId,
    figuraProponente: figura,
    razonSocial: razonSocial,
    representanteLegal: representante,
    telefonoContacto: telefono,
    emailContacto: email,
    emailContacto2: email2,
    convocatoriaId: convocatoriaActual,
    fechaPostulacion: new Date().toISOString()
  };
  
  try {
    // Mostrar indicador de carga
    const btnEnviar = event.target;
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    
    const response = await fetch('http://tgi-ptu.bucaramanga.upb.edu.co:3000/api/postulaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosFormulario)
    });
    
    if (response.ok) {
      const resultado = await response.json();
      alert('✅ ¡Postulación enviada exitosamente!\nID: ' + resultado.id);
      cerrarDetalles();
    } else {
      const error = await response.json();
      alert('❌ Error al enviar: ' + (error.mensaje || 'Intente nuevamente'));
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar Postulación';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión: ' + error.message);
    const btnEnviar = event.target;
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar Postulación';
  }
}

// Cerrar modal
function cerrarDetalles() {
  document.getElementById('detallesModal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = (event) => {
  const modal = document.getElementById('detallesModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página cargada. Las convocatorias están listas.');
});