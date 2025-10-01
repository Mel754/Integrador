class AsignacionModel {
    constructor() {
        this.asignaciones = this.cargarAsignaciones();
    }

    cargarAsignaciones() {
        const asignacionesGuardadas = localStorage.getItem('asignaciones');
        return asignacionesGuardadas ? JSON.parse(asignacionesGuardadas) : [];
    }

    guardarAsignaciones() {
        localStorage.setItem('asignaciones', JSON.stringify(this.asignaciones));
    }

    asignarRol(usuarioId, rolId, proyectoId) {
        const nuevaAsignacion = {
            id: Date.now(),
            usuarioId,
            rolId,
            proyectoId,
            fechaAsignacion: new Date().toISOString()
        };
        this.asignaciones.push(nuevaAsignacion);
        this.guardarAsignaciones();
        return nuevaAsignacion;
    }

    obtenerAsignacionesPorProyecto(proyectoId) {
        return this.asignaciones.filter(a => a.proyectoId === proyectoId);
    }

    obtenerAsignacionesPorUsuario(usuarioId) {
        return this.asignaciones.filter(a => a.usuarioId === usuarioId);
    }

    eliminarAsignacion(id) {
        this.asignaciones = this.asignaciones.filter(a => a.id !== id);
        this.guardarAsignaciones();
    }
}