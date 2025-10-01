class ProyectosController {
    constructor(proyectoModel, hitoModel) {
        this.proyectoModel = proyectoModel;
        this.hitoModel = hitoModel;
        this.view = new ProyectosView();
        this.miembrosTemporales = [];
        this.hitoEnEdicion = null;
    }
    inicializar() {
        this.renderizar();
        const usuarios = window.app.usuarioModel.obtenerTodos();
        this.view.cargarUsuariosEnSelect(usuarios);
        this.view.actualizarTablaProyectos(this.proyectoModel.obtenerTodos());
        this.configurarEventos();
    }
    renderizar() {
        const proyectos = this.proyectoModel.obtenerTodos();
        this.view.render(proyectos);
        this.view.cargarProyectosEnSelect(this.proyectoModel.obtenerTodos());        
        const hitos = this.hitoModel.obtenerTodos();
        this.view.renderGantt(hitos);
        
        this.crearModalesHito();
        this.configurarEventos();
    }
    renderProyectosDetallados() {
        const filtro = document.getElementById("filtroEstado").value;
        let proyectos = this.proyectoModel.obtenerTodos();
        
        if (filtro !== "Todos") {
            proyectos = proyectos.filter(p => p.estado === filtro);
        }
        const tbody = document.getElementById("tablaProyectosDetallados");
        tbody.innerHTML = "";
        
        proyectos.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.fechaInicio || '-'}</td>
            <td>${p.fechaFin || '-'}</td>
            <td>${p.estado || '-'}</td>
            <td>${p.descripcion || '-'}</td>
            <td>${p.lider || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    configurarEventos() { 
        document.querySelectorAll('.filtros button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filtro = e.target.dataset.filtro;
                this.filtrarProyectos(filtro);
            });
        });
        const buscador = document.getElementById('buscadorProyectos');
        if (buscador) {
            buscador.addEventListener('input', (e) => {
                this.buscarProyectos(e.target.value);
            });
        }
        const contenedor = document.getElementById("proyectos");
        if (contenedor) {
            contenedor.addEventListener("click", (e) => {
                if (e.target && e.target.id === "btnCrearProyecto") {
                    this.crearProyecto();
                }
            });
        }
        const btnAgregarMiembro = document.getElementById('btnAgregarMiembro');
        if (btnAgregarMiembro) {
            btnAgregarMiembro.addEventListener('click', () => {
                this.agregarMiembro();
            });
        }
        const hitoForm = document.getElementById('hitoForm');
        if (hitoForm) {
            hitoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.agregarHito();
            });
        }
        const btnVerProyectos = document.getElementById("btnVerProyectos");
        if (btnVerProyectos) {
            btnVerProyectos.addEventListener("click", () => {
                console.log('clicl en vpd');
                const seccion = document.getElementById("proyectosDetallados");
                if (!seccion) {
                    console.error('cero');
                    return;
                }            
                if (seccion.style.display === "none" || seccion.style.display === "") {            
                    seccion.style.display = "block";   
                    btnVerProyectos.textContent = "Ocultar Proyectos";
                    this.cargarProyectosDetallados();
                } else {            
                    seccion.style.display = "none";  
                    btnVerProyectos.textContent = "Ver Proyectos";          
                }        
            });    
        }    
        const filtroEstado = document.getElementById("filtroEstado");    
        if (filtroEstado) {    
            filtroEstado.addEventListener("change", () => {    
                this.cargarProyectosDetallados(filtroEstado.value);    
            });    
        }    
        this.configurarEventosGantt();    
    }
    crearProyecto() {
        const nombre = document.getElementById('nombreProyecto').value.trim();
        const descripcion = document.getElementById('descripcionProyecto').value.trim();
        const fechaInicio = document.getElementById('fechaInicioProyecto').value;
        const fechaFin = document.getElementById('fechaFinProyecto').value;
        
        const liderSelect = document.getElementById('liderProyecto');
        const lider = liderSelect.value || 'Sin asignar';

        const miembrosSelect = document.getElementById('miembrosProyecto');
        const miembros = Array.from(miembrosSelect.selectedOptions).map(o => o.textContent);
 
        const miembrosFinales = miembros.length > 0 ? miembros : ['Sin miembros'];
        console.log('Datos:', { nombre, descripcion, fechaInicio, fechaFin, lider });

        if (!nombre) {
            alert('Por favor ingresa el nombre del proyecto');
            return;
        }
        if (!fechaInicio || !fechaFin) {
            alert('Por favor selecciona las fechas de inicio y fin');
            return;
        }
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            alert('La fecha de inicio no puede ser posterior a la fecha de fin');
            return;
        }
        const nuevoProyecto = this.proyectoModel.agregar({
            nombre,
            descripcion: descripcion || 'Sin descripción',
            estado: 'Activo',
            miembros: miembrosFinales,
            lider: lider || 'Sin asignar',
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            fechaEstimada: fechaFin,
            progreso: 0
        });

        console.log('Proyecto agregado:', nuevoProyecto);

        this.view.actualizarTablaProyectos(this.proyectoModel.obtenerTodos());

        document.getElementById('nombreProyecto').value = '';
        document.getElementById('descripcionProyecto').value = '';
        document.getElementById('fechaInicioProyecto').value = '';
        document.getElementById('fechaFinProyecto').value = '';
        liderSelect.selectedIndex = 0;
        miembrosSelect.selectedIndex = -1;
        
        alert(`Proyecto "${nuevoProyecto.nombre}" creado exitosamente`);
        console.log('=== FIN crearProyecto ===');
    }
    configurarEventosGantt() {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hitoId = parseInt(e.target.dataset.hitoId);
                this.editarHito(hitoId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hitoId = parseInt(e.target.dataset.hitoId);
                this.eliminarHito(hitoId);
            });
        });
    }
    filtrarProyectos(filtro) {
        let proyectos;
        if (filtro === 'Activos') {
            proyectos = this.proyectoModel.filtrarPorEstado('Activo');
        } else if (filtro === 'Pendientes') {
            proyectos = this.proyectoModel.filtrarPorEstado('Pendiente');
        } else {
            proyectos = this.proyectoModel.obtenerTodos();
        }
        this.view.actualizarTablaProyectos(proyectos);
    }
    buscarProyectos(termino) {
        const proyectos = this.proyectoModel.obtenerTodos();
        const filtrados = proyectos.filter(p => 
            p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            (p.miembros && p.miembros.some(m => m.toLowerCase().includes(termino.toLowerCase())))
        );
        this.view.actualizarTablaProyectos(filtrados);
    }
    agregarMiembro() {
        const input = document.getElementById('miembroProyecto');
        const lista = document.getElementById('listaMiembros');
        
        if (input && input.value.trim() !== '') {
            this.miembrosTemporales.push(input.value.trim());
            const li = document.createElement('li');
            li.textContent = input.value.trim();
            lista.appendChild(li);
            input.value = '';
        } else {
            alert('Por favor, escribe un nombre antes de agregar.');
        }
    }
    agregarHito() {
        const nombre = document.getElementById('nombreHito').value.trim();
        const proyectoId = parseInt(document.getElementById('proyectoHito').value);
        const inicio = document.getElementById('fechaInicioHito').value;
        const fin = document.getElementById('fechaFinHito').value;
        const estadoSelect = document.getElementById('estadoHito');
        const estado = estadoSelect ? estadoSelect.value : 'pendiente';

        if (!nombre || !proyectoId || !inicio || !fin) {
            alert('Por favor complete todos los campos');
            return;
        }
        if (new Date(inicio) > new Date(fin)) {
            alert('La fecha de inicio no puede ser posterior a la fecha de finalización');
            return;
        }
        const proyectoObj = this.proyectoModel.obtenerPorId(proyectoId);
        const proyectoNombre = proyectoObj ? proyectoObj.nombre : 'Sin proyecto';

        this.hitoModel.agregar({
            id: Date.now(),
            nombre,
            proyecto: proyectoNombre,
            inicio,
            fin,
            estado
        });

        const hitos = this.hitoModel.obtenerTodos();
        this.view.renderGantt(hitos);
        this.configurarEventosGantt();

        document.getElementById('hitoForm').reset();
        alert('Hito "${nuevoHito.nombre}" agregado al proyecto "${proyectoNombre}"');
    }
    editarHito(hitoId) {
        const hito = this.hitoModel.obtenerPorId(hitoId);
        if (!hito) {
            alert('Hito no encontrado');
            return;
        }
        this.hitoEnEdicion = hitoId;
        this.view.mostrarModalEditarHito(hito);
    }
    eliminarHito(hitoId) {
        const hito = this.hitoModel.obtenerPorId(hitoId);
        if (!hito) {
            alert('Hito no encontrado');
            return;
        }

        if (confirm(`¿Estás seguro de que quieres eliminar el hito "${hito.nombre}"?`)) {
            this.hitoModel.eliminar(hitoId);
            const hitos = this.hitoModel.obtenerTodos();
            this.view.renderGantt(hitos);
            this.configurarEventosGantt();
            alert('Hito eliminado exitosamente');
        }
    }
    guardarEdicionHito() {
        if (!this.hitoEnEdicion) {
            alert('Error: No hay hito seleccionado para editar');
            return;
        }

        const nombre = document.getElementById('editNombreHito').value;
        const proyecto = document.getElementById('editProyecto').value;
        const inicio = document.getElementById('editFechaInicio').value;
        const fin = document.getElementById('editFechaFin').value;
        const estado = document.getElementById('editEstadoHito').value;

        if (!nombre || !inicio || !fin) {
            alert('Por favor complete todos los campos');
            return;
        }

        if (new Date(inicio) > new Date(fin)) {
            alert('La fecha de inicio no puede ser posterior a la fecha de finalización');
            return;
        }

        this.hitoModel.actualizar(this.hitoEnEdicion, {
            nombre,
            proyecto,
            inicio,
            fin,
            estado
        });

        const hitos = this.hitoModel.obtenerTodos();
        this.view.renderGantt(hitos);
        this.configurarEventosGantt();

        this.cerrarModalEditarHito();
        alert('Hito actualizado exitosamente');
    }
    crearModalesHito() {
        const modalContainer = document.getElementById('modales-container');
        const modalHTML = `
            <div id="modal-editar-hito" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="window.app.proyectosController.cerrarModalEditarHito()">&times;</span>
                    <h2>Editar Hito</h2>
                    <form id="formEditarHito">
                        <div class="form-row">
                            <div class="form-field">
                                <label for="editProyecto">Proyecto asociado:</label>
                                <select id="editProyecto" required>
                                    <option value="">Seleccione...</option>
                                    <option value="Proyecto 1">Proyecto 1</option>
                                    <option value="Proyecto 2">Proyecto 2</option>
                                </select>
                            </div>
                            <div class="form-field">
                                <label for="editFechaInicio">Fecha inicio:</label>
                                <input type="date" id="editFechaInicio" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label for="editFechaFin">Fecha fin:</label>
                                <input type="date" id="editFechaFin" required>        
                            </div>
                            <div class="form-field">
                                <label for="editEstadoHito">Estado:</label>
                                <select id="editEstadoHito">
                                    <option value="pendiente">Pendiente</option>
                                    <option value="progreso">En Progreso</option>
                                    <option value="completado">Completado</option>
                                    <option value="retrasado">Retrasado</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label for="editNombreHito">Nombre del Hito:</label>
                                <input type="text" id="editNombreHito" placeholder="Ej: Definir requisitos" required>
                            </div>
                        </div>
                        <button type="submit" class="btn-agregar">Guardar Cambios</button>
                    </form>
                </div>
            </div>
        `;
        modalContainer.innerHTML += modalHTML;

        const formEditar = document.getElementById('formEditarHito');
        if (formEditar) {
            formEditar.addEventListener('submit', (e) => {
                e.preventDefault();
                this.guardarEdicionHito();
            });
        }
    }
    cerrarModalEditarHito() {
        const modal = document.getElementById('modal-editar-hito');
        if (modal) {
            modal.style.display = 'none';
            this.hitoEnEdicion = null;
        }
    }
}