class CalificacionModel {
    constructor() {
        this.calificaciones = this.cargarCalificaciones();
        this.contador = this.calificaciones.length > 0 ? Math.max(...this.calificaciones.map(c => c.id)) + 1 : 1;
    }

    cargarCalificaciones() {
        const guardadas = localStorage.getItem('calificaciones');
        return guardadas ? JSON.parse(guardadas) : [];
    }

    guardarCalificaciones() {
        localStorage.setItem('calificaciones', JSON.stringify(this.calificaciones));
    }

    agregar(calificacion) {
        const nueva = {
            id: this.contador++,
            ...calificacion,
            fechaCreacion: new Date().toISOString(),
            ultimaActualizacion: new Date().toISOString()
        };
        this.calificaciones.push(nueva);
        this.guardarCalificaciones();
        return nueva;
    }

    obtenerTodas() {
        return this.calificaciones;
    }

    obtenerPorSolicitud(solicitudId) {
        return this.calificaciones.filter(c => c.solicitudId === solicitudId);
    }

    obtenerPorUsuario(usuarioId) {
        return this.calificaciones.filter(c => c.usuarioId === usuarioId);
    }

    obtenerPorEstado(estado) {
        return this.calificaciones.filter(c => c.estado === estado);
    }

    actualizar(id, datos) {
        const index = this.calificaciones.findIndex(c => c.id === id);
        if (index !== -1) {
            this.calificaciones[index] = {
                ...this.calificaciones[index],
                ...datos,
                ultimaActualizacion: new Date().toISOString()
            };
            this.guardarCalificaciones();
            return this.calificaciones[index];
        }
        return null;
    }

    cambiarEstado(id, nuevoEstado) {
        return this.actualizar(id, { estado: nuevoEstado });
    }

    visualizar(id, usuarioId) {
        const calificacion = this.calificaciones.find(c => c.id === id);
        if (calificacion && !calificacion.visualizadoPor) {
            calificacion.visualizadoPor = usuarioId;
            calificacion.fechaVisualizacion = new Date().toISOString();
            this.guardarCalificaciones();
        }
        return calificacion;
    }
}