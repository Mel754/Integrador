class TareaModel {
    constructor() {
        this.tareas = this.cargarTareas();
        this.contador = this.tareas.length > 0 ? Math.max(...this.tareas.map(t => t.id)) + 1 : 1;
    }

    cargarTareas() {
        const tareasGuardadas = localStorage.getItem('tareas');
        return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
    }

    guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    agregar(tarea) {
        const nuevaTarea = {
            id: this.contador++,
            ...tarea,
            fechaCreacion: new Date().toISOString(),
            estado: 'pendiente'
        };
        this.tareas.push(nuevaTarea);
        this.guardarTareas();
        return nuevaTarea;
    }

    obtenerTodas() {
        return this.tareas;
    }

    obtenerPorProyecto(proyectoId) {
        return this.tareas.filter(t => t.proyectoId === proyectoId);
    }

    obtenerPorUsuario(usuarioId) {
        return this.tareas.filter(t => t.asignadoA === usuarioId);
    }

    actualizar(id, datos) {
        const index = this.tareas.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tareas[index] = { ...this.tareas[index], ...datos };
            this.guardarTareas();
            return this.tareas[index];
        }
        return null;
    }

    eliminar(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarTareas();
    }

    obtenerEstadisticasPorRol(rol) {
        const tareasPorRol = this.tareas.filter(t => t.rol === rol);
        const completadas = tareasPorRol.filter(t => t.estado === 'completada').length;
        const total = tareasPorRol.length;
        return {
            total,
            completadas,
            pendientes: total - completadas,
            porcentaje: total > 0 ? ((completadas / total) * 100).toFixed(1) : 0
        };
    }
}