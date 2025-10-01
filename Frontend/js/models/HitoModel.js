class HitoModel {
    constructor() {
        this.hitos = this.cargarHitos();
        this.contador = this.hitos.length > 0 ? Math.max(...this.hitos.map(h => h.id)) + 1 : 1;
    }

    cargarHitos() {
        const hitosGuardados = localStorage.getItem('hitos');
        return hitosGuardados ? JSON.parse(hitosGuardados) : [];
    }

    guardarHitos() {
        localStorage.setItem('hitos', JSON.stringify(this.hitos));
    }

    agregar(hito) {
        const nuevoHito = {
            id: this.contador++,
            ...hito
        };
        this.hitos.push(nuevoHito);
        this.hitos.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
        this.guardarHitos();
        return nuevoHito;
    }

    obtenerTodos() {
        return this.hitos;
    }

    obtenerPorId(id) {
        return this.hitos.find(h => h.id === id);
    }

    actualizar(id, datos) {
        const index = this.hitos.findIndex(h => h.id === id);
        if (index !== -1) {
            this.hitos[index] = { ...this.hitos[index], ...datos };
            this.hitos.sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
            this.guardarHitos();
            return this.hitos[index];
        }
        return null;
    }

    eliminar(id) {
        this.hitos = this.hitos.filter(h => h.id !== id);
        this.guardarHitos();
    }
}