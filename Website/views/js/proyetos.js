// Base de datos de proyectos
const proyectosDB = [
  {
    id: 1,
    titulo: "Implementación de Brazos Robóticos Colaborativos",
    descripcion: "Instalación de brazos robóticos colaborativos para aumentar la productividad y seguridad en líneas de manufactura.",
    sector: "Robótica Colaborativa",
    estado: "Activo",
    departamento: "Santander",
    año: 2025,
    descripcionCompleta: "Este proyecto busca revolucionar el proceso de manufactura mediante la integración de brazos robóticos colaborativos de última generación.",
    objetivos: [
      "Aumentar la productividad en un 40%",
      "Mejorar la seguridad de los operarios",
      "Reducir errores de producción",
      "Optimizar tiempos de ciclo"
    ],
    beneficios: [
      "Automatización segura con humanos",
      "Menor tiempo de configuración",
      "Mayor flexibilidad en líneas de producción",
      "ROI en menos de 2 años"
    ],
    resultados: [
      "Producción aumentada 35%",
      "Cero accidentes desde implementación",
      "Reducción de defectos 60%",
      "Satisfacción del cliente 95%"
    ],
    empresa: "Empresa Asociada XYZ",
    tecnologias: "Robótica colaborativa, Control inteligente, IoT"
  },
  {
    id: 2,
    titulo: "Sistema de Automatización Inteligente para Logística",
    descripcion: "Desarrollo de soluciones de automatización inteligente para optimizar procesos de distribución y almacenamiento.",
    sector: "Logística y Distribución",
    estado: "Activo",
    departamento: "Antioquia",
    año: 2025,
    descripcionCompleta: "Sistema integral que automatiza operaciones logísticas complejas usando IA y robótica avanzada.",
    objetivos: [
      "Automatizar procesos de picking",
      "Reducir tiempo de entrega",
      "Optimizar uso de almacenes",
      "Integración con sistemas ERP"
    ],
    beneficios: [
      "Eficiencia operacional 50% mayor",
      "Reducción de errores en picking",
      "Escalabilidad automática",
      "Visibilidad en tiempo real"
    ],
    resultados: [
      "Tiempo procesamiento -45%",
      "Errores -70%",
      "Capacidad +60%",
      "ROI en 18 meses"
    ],
    empresa: "Empresa Asociada ABC",
    tecnologias: "Machine Learning, Robótica, IoT, Big Data"
  },
  {
    id: 3,
    titulo: "Plataforma de IoT Industrial para Monitoreo",
    descripcion: "Plataforma integrada para monitoreo en tiempo real de máquinas y procesos industriales con inteligencia artificial.",
    sector: "Industria 4.0",
    estado: "Completado",
    departamento: "Bogotá",
    año: 2024,
    descripcionCompleta: "Solución cloud para monitoreo predictivo y mantenimiento preventivo de equipos industriales.",
    objetivos: [
      "Predicción de fallos 95% precisión",
      "Reducir tiempos de parada",
      "Optimizar mantenimiento",
      "Mejorar eficiencia energética"
    ],
    beneficios: [
      "Predictibilidad de fallos",
      "Mantenimiento preventivo automatizado",
      "Ahorro energético 25%",
      "Visibilidad total operacional"
    ],
    resultados: [
      "Disponibilidad 99.2%",
      "Ahorro operacional 30%",
      "Paradas no programadas -80%",
      "Certificación ISO 20000"
    ],
    empresa: "Empresa Asociada DEF",
    tecnologias: "IoT, Cloud Computing, AI, Analytics"
  },
  {
    id: 4,
    titulo: "Sistema de Control Automatizado para Manufactura",
    descripcion: "Implementación de sistemas de control automático para optimizar producción y reducir costos operacionales.",
    sector: "Manufactura",
    estado: "Activo",
    departamento: "Valle del Cauca",
    año: 2024,
    descripcionCompleta: "Control automático de procesos de manufactura con PLC y SCADA integrados.",
    objetivos: [
      "Automatizar controles de proceso",
      "Optimizar parámetros de producción",
      "Reducir desperdicios",
      "Mejorar consistencia de producto"
    ],
    beneficios: [
      "Control preciso de variables",
      "Consistencia de producto",
      "Reducción de variabilidad",
      "Facilidad de integración"
    ],
    resultados: [
      "Precisión ±0.1%",
      "Consistencia 98%",
      "Reducción costos 28%",
      "Satisfacción clientes 96%"
    ],
    empresa: "Empresa Asociada GHI",
    tecnologias: "PLC, SCADA, Control automático, Sensórica"
  },
  {
    id: 5,
    titulo: "Sistema de Visión Artificial para Control de Calidad",
    descripcion: "Desarrollo de soluciones de visión artificial para inspección automática de productos y control de calidad.",
    sector: "Control de Calidad",
    estado: "Activo",
    departamento: "Santander",
    año: 2024,
    descripcionCompleta: "Sistema de visión artificial con deep learning para inspección automática a alta velocidad.",
    objetivos: [
      "Detección de defectos automática",
      "Inspección 100% de producción",
      "Eliminar inspección manual",
      "Reportes en tiempo real"
    ],
    beneficios: [
      "Detección defectos 99.2%",
      "Eliminación de inspección manual",
      "Aumento velocidad inspección",
      "Trazabilidad completa"
    ],
    resultados: [
      "Precisión 99.5%",
      "Velocidad 500 partes/min",
      "Rechazo defectuosos -95%",
      "Ahorro inspección $150k/año"
    ],
    empresa: "Empresa Asociada JKL",
    tecnologias: "Visión por computadora, Deep Learning, CNN"
  },
  {
    id: 6,
    titulo: "Automatización de Procesos de Empaque y Etiquetado",
    descripcion: "Sistema integrado de automatización para empaque y etiquetado automático con alta precisión y velocidad.",
    sector: "Empaque",
    estado: "Completado",
    departamento: "Antioquia",
    año: 2023,
    descripcionCompleta: "Línea de empaque y etiquetado completamente automatizada con robótica e integración de sistemas.",
    objetivos: [
      "Automatizar empaque completo",
      "Aumentar velocidad de línea",
      "Mejorar presentación producto",
      "Reducir mano de obra directa"
    ],
    beneficios: [
      "Velocidad 1000 unidades/hora",
      "Presentación uniforme",
      "Reducción personal 70%",
      "Flexibilidad de formatos"
    ],
    resultados: [
      "Velocidad línea +250%",
      "Calidad empaque 100%",
      "Ahorro laboral $200k/año",
      "Clientes satisfechos 98%"
    ],
    empresa: "Empresa Asociada MNO",
    tecnologias: "Robótica industrial, Control automático, Visión"
  }
];

// Función para abrir el modal de detalles
function abrirDetalles(id) {
  const proyecto = proyectosDB.find(p => p.id === id);
  if (!proyecto) return;

  const modal = document.getElementById('detallesModal');
  const contenido = document.getElementById('detallesContenido');

  contenido.innerHTML = `
    <h2>${proyecto.titulo}</h2>
    
    <div class="detalle-seccion">
      <h3>📋 Descripción General</h3>
      <p class="descripcion-general">${proyecto.descripcionCompleta}</p>
    </div>

    <div class="detalle-seccion">
      <h3>📊 Información del Proyecto</h3>
      <p><strong>Sector:</strong> ${proyecto.sector}</p>
      <p><strong>Estado:</strong> ${proyecto.estado}</p>
      <p><strong>Departamento:</strong> ${proyecto.departamento}</p>
      <p><strong>Año:</strong> ${proyecto.año}</p>
      <p><strong>Empresa Asociada:</strong> ${proyecto.empresa}</p>
      <p><strong>Tecnologías:</strong> ${proyecto.tecnologias}</p>
    </div>

    <div class="detalle-seccion">
      <h3>🎯 Objetivos</h3>
      <ul class="lista-beneficios">
        ${proyecto.objetivos.map(obj => `<li>${obj}</li>`).join('')}
      </ul>
    </div>

    <div class="detalle-seccion">
      <h3>✨ Beneficios</h3>
      <ul class="lista-beneficios">
        ${proyecto.beneficios.map(ben => `<li>${ben}</li>`).join('')}
      </ul>
    </div>

    <div class="detalle-seccion">
      <h3>🏆 Resultados Alcanzados</h3>
      <ul class="lista-beneficios">
        ${proyecto.resultados.map(res => `<li>${res}</li>`).join('')}
      </ul>
    </div>

    <div class="nota-box">
      <strong>📌 Nota:</strong> Este proyecto forma parte de nuestro portafolio de innovación en automatización y robótica industrial. Para mayor información, contáctanos.
    </div>
  `;

  modal.style.display = 'block';
}

// Función para cerrar el modal
function cerrarDetalles() {
  document.getElementById('detallesModal').style.display = 'none';
}

// Cerrar el modal al hacer clic fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById('detallesModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}