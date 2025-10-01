class ProyectoModel {
    constructor() {
        const guardados = localStorage.getItem('proyectos');
        this.proyectos = guardados ? JSON.parse(guardados) : [];
        this.contadorId = this.proyectos.length > 0
            ? Math.max(...this.proyectos.map(p => p.id)) + 1
            : 1;
    }
    guardarProyectos() {
        localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
    }
    obtenerTodos() {
        return this.proyectos;
    }
    obtenerPorId(id) {
        return this.proyectos.find(p => p.id === id);
    }
    agregar(proyecto) {
        proyecto.id = this.contadorId++;
        this.proyectos.push(proyecto);
        this.guardarProyectos();
        return proyecto;
    }
    actualizar(id, datos) {
        const index = this.proyectos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.proyectos[index] = { ...this.proyectos[index], ...datos };
            this.guardarProyectos();
            return this.proyectos[index];
        }
        return null;
    }
    eliminar(id) {
        this.proyectos = this.proyectos.filter(p => p.id !== id);
        this.guardarProyectos();
    }
    filtrarPorEstado(estado) {
        if (estado === 'Todos') return this.proyectos;
        return this.proyectos.filter(p => p.estado === estado);
    }
    contarActivos() {
        return this.proyectos.filter(p => p.estado === 'Activo').length;
    }
}