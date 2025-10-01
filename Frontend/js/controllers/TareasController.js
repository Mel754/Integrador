class TareasController {
    constructor(tareaModel, usuarioModel, proyectoModel, rolModel) {
        this.tareaModel = tareaModel;
        this.usuarioModel = usuarioModel;
        this.proyectoModel = proyectoModel;
        this.rolModel = rolModel;
        this.view = new TareasView();
        this.filtroActual = 'todas';
    }

    inicializar() {
        this.renderizar();
        this.configurarEventos();
    }

    renderizar() {
        const data = {
            tareas: this.tareaModel.obtenerTodas(),
            usuarios: this.usuarioModel.obtenerTodos(),
            proyectos: this.proyectoModel.obtenerTodos(),
            roles: this.rolModel.obtenerTodos(),
            esAdmin: this.usuarioModel.esAdmin()
        };

        this.view.render(data);
    }

    configurarEventos() {
        // US-34.03: Formulario de nueva tarea
        const formTarea = document.getElementById('formNuevaTarea');
        if (formTarea) {
            formTarea.addEventListener('submit', (e) => {
                e.preventDefault();
                this.crearTarea();
            });
        }

        // Filtros de tareas
        document.querySelectorAll('.filtros button[data-filtro]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filtroActual = e.target.dataset.filtro;
                this.aplicarFiltro();
            });
        });

        // Cambiar estado de tarea
        document.querySelectorAll('.tarea-estado-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const tareaId = parseInt(e.target.dataset.tareaId);
                const nuevoEstado = e.target.value;
                this.cambiarEstadoTarea(tareaId, nuevoEstado);
            });
        });

        // Eliminar tarea
        document.querySelectorAll('.btn-delete-tarea').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tareaId = parseInt(e.target.dataset.tareaId);
                this.eliminarTarea(tareaId);
            });
        });
    }

    crearTarea() {
        if (!this.usuarioModel.esAdmin()) {
            alert('Solo los administradores pueden crear tareas.');
            return;
        }

        const titulo = document.getElementById('tituloTarea').value;
        const proyectoId = parseInt(document.getElementById('proyectoTarea').value);
        const usuarioId = parseInt(document.getElementById('usuarioTarea').value);
        const rol = document.getElementById('rolTarea').value;
        const prioridad = document.getElementById('prioridadTarea').value;
        const descripcion = document.getElementById('descripcionTarea').value;
        const fechaInicio = document.getElementById('fechaInicioTarea').value;
        const fechaFin = document.getElementById('fechaFinTarea').value;

        if (!titulo || !proyectoId || !usuarioId || !rol || !descripcion || !fechaInicio || !fechaFin) {
            alert('Por favor complete todos los campos.');
            return;
        }

        if (new Date(fechaInicio) > new Date(fechaFin)) {
            alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }

        this.tareaModel.agregar({
            titulo,
            proyectoId,
            asignadoA: usuarioId,
            rol,
            prioridad,
            descripcion,
            fechaInicio,
            fechaFin
        });

        alert('Tarea creada exitosamente!');
        this.inicializar();
    }

    aplicarFiltro() {
        this.view.actualizarTareas(
            this.tareaModel.obtenerTodas(),
            this.usuarioModel.obtenerTodos(),
            this.proyectoModel.obtenerTodos(),
            this.usuarioModel.esAdmin(),
            this.filtroActual
        );
        this.configurarEventos();
    }

    cambiarEstadoTarea(tareaId, nuevoEstado) {
        if (!this.usuarioModel.esAdmin()) {
            alert('Solo los administradores pueden cambiar el estado de las tareas.');
            return;
        }

        this.tareaModel.actualizar(tareaId, { estado: nuevoEstado });
        alert('Estado actualizado exitosamente!');
        this.aplicarFiltro();
    }

    eliminarTarea(tareaId) {
        if (!this.usuarioModel.esAdmin()) {
            alert('Solo los administradores pueden eliminar tareas.');
            return;
        }

        if (confirm('¿Está seguro de eliminar esta tarea?')) {
            this.tareaModel.eliminar(tareaId);
            alert('Tarea eliminada exitosamente.');
            this.aplicarFiltro();
        }
    }
}