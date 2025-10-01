class ServicioModel {
    constructor() {
        this.solicitudes = this.cargarSolicitudes();
        this.contador = this.solicitudes.length > 0 ? Math.max(...this.solicitudes.map(s => s.id)) + 1 : 1;
    }

    cargarSolicitudes() {
        const solicitudesGuardadas = localStorage.getItem('solicitudes');
        return solicitudesGuardadas ? JSON.parse(solicitudesGuardadas) : [];
    }

    guardarSolicitudes() {
        localStorage.setItem('solicitudes', JSON.stringify(this.solicitudes));
    }

    agregar(solicitud) {
        const nuevaSolicitud = {
            id: this.contador++,
            ...solicitud,
            estado: 'Pendiente',
            registradoEl: new Date().toLocaleString()
        };
        this.solicitudes.push(nuevaSolicitud);
        this.guardarSolicitudes();
        return nuevaSolicitud;
    }

    obtenerTodas() {
        return this.solicitudes;
    }

    contarServicios() {
        return this.solicitudes.length  
        ;
    }
}