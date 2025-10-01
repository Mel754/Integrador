class RolesController {
    constructor(rolModel, usuarioModel, proyectoModel, asignacionModel, tareaModel) {
        this.rolModel = rolModel;
        this.usuarioModel = usuarioModel;
        this.proyectoModel = proyectoModel;
        this.asignacionModel = asignacionModel;
        this.tareaModel = tareaModel;
        this.view = new RolesView();
    }

    inicializar() {
        this.renderizar();
        this.configurarEventos();
    }

    renderizar() {
        const estadisticasPorRol = {};
        this.rolModel.obtenerTodos().forEach(rol => {
            estadisticasPorRol[rol.id] = this.tareaModel.obtenerEstadisticasPorRol(rol.nombre);
        });

        const data = {
            roles: this.rolModel.obtenerTodos(),
            usuarios: this.usuarioModel.obtenerTodos(),
            proyectos: this.proyectoModel.obtenerTodos(),
            asignaciones: this.asignacionModel.asignaciones,
            esAdmin: this.usuarioModel.esAdmin(),
            estadisticasPorRol
        };

        this.view.render(data);
    }

    configurarEventos() {
        // US-34.01: Botón asignar rol
        const btnAsignarRol = document.getElementById('btnAsignarRol');
        if (btnAsignarRol) {
            btnAsignarRol.addEventListener('click', () => this.asignarRol());
        }

        // US-34.02: Filtro de participantes
        const filtroProyecto = document.getElementById('filtroProyectoParticipantes');
        if (filtroProyecto) {
            filtroProyecto.addEventListener('change', (e) => {
                this.view.actualizarParticipantes(
                    this.asignacionModel.asignaciones,
                    this.usuarioModel.obtenerTodos(),
                    this.rolModel.obtenerTodos(),
                    this.proyectoModel.obtenerTodos(),
                    e.target.value
                );
            });
        }

        document.querySelectorAll('.btn-delete[data-asignacion-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const asignacionId = parseInt(e.target.dataset.asignacionId);
                this.eliminarAsignacion(asignacionId);
            });
        });
    }

    asignarRol() {
        // US-34.07: Validar que solo administradores puedan asignar
        if (!this.usuarioModel.esAdmin()) {
            alert('Solo los administradores pueden asignar roles.');
            return;
        }

        const usuarioId = parseInt(document.getElementById('usuarioSelect').value);
        const rolId = parseInt(document.getElementById('rolSelect').value);
        const proyectoId = parseInt(document.getElementById('proyectoSelect').value);

        if (!usuarioId || !rolId || !proyectoId) {
            alert('Por favor complete todos los campos.');
            return;
        }

        // Verificar si ya existe esta asignación
        const existeAsignacion = this.asignacionModel.asignaciones.some(
            a => a.usuarioId === usuarioId && a.proyectoId === proyectoId
        );

        if (existeAsignacion) {
            if (!confirm('Este usuario ya tiene un rol asignado en este proyecto. ¿Desea reemplazarlo?')) {
                return;
            }
            // Eliminar asignación anterior
            const asignacionAnterior = this.asignacionModel.asignaciones.find(
                a => a.usuarioId === usuarioId && a.proyectoId === proyectoId
            );
            if (asignacionAnterior) {
                this.asignacionModel.eliminarAsignacion(asignacionAnterior.id);
            }
        }

        this.asignacionModel.asignarRol(usuarioId, rolId, proyectoId);
        
        alert('Rol asignado exitosamente!');
        this.inicializar();
    }

    eliminarAsignacion(asignacionId) {
        if (!this.usuarioModel.esAdmin()) {
            alert('Solo los administradores pueden eliminar asignaciones.');
            return;
        }

        if (confirm('¿Está seguro de eliminar esta asignación?')) {
            this.asignacionModel.eliminarAsignacion(asignacionId);
            this.inicializar();
            alert('Asignación eliminada exitosamente.');
        }
    }
}