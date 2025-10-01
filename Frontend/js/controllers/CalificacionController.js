class CalificacionController {
    constructor(calificacionModel, servicioModel, usuarioModel) {
        this.calificacionModel = calificacionModel;
        this.servicioModel = servicioModel;
        this.usuarioModel = usuarioModel;
        this.view = new CalificacionView();
        this.filtroActual = 'todas';
    }

    inicializar() {
        this.renderizar();
        this.configurarEventos();
    }

    renderizar() {
        const usuarioActual = this.usuarioModel.usuarioActual || {};
        const solicitudesUsuario = this.servicioModel.obtenerTodas()
            .filter(s => s.estado === 'completada' || s.tipo === 'Asesoría');
        
        const calificaciones = this.calificacionModel.obtenerTodas();
        
        const resumen = this.calcularResumen(calificaciones);

        const data = {
            esUsuarioAutorizado: solicitudesUsuario.length > 0,
            solicitudesUsuario,
            calificaciones,
            resumen
        };

        this.view.render(data);
    }

    configurarEventos() {
        const form = document.getElementById('formCalificacion');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.enviarCalificacion();
            });
        }

        document.querySelectorAll('.filtros button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filtroActual = e.target.dataset.filtro;
                this.aplicarFiltro();
            });
        });

        document.querySelectorAll('.btn-ver-detalle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.calificacionId);
                this.verDetalle(id);
            });
        });
    }

    enviarCalificacion() {
        const solicitudId = parseInt(document.getElementById('solicitudCalificacion').value);
        const puntuacion = parseInt(document.getElementById('puntuacion').value);
        const comentario = document.getElementById('comentario').value.trim();

        if (!solicitudId || !puntuacion) {
            this.view.mostrarMensaje('Complete todos los campos obligatorios', 'error');
            return;
        }

        const usuarioActual = this.usuarioModel.usuarioActual || {};
        
        const nuevaCalificacion = this.calificacionModel.agregar({
            solicitudId,
            usuarioId: usuarioActual.id || 1,
            puntuacion,
            comentario,
            estado: 'pendiente',
            lugar: 'Centro de Asesorías'
        });

        this.view.mostrarMensaje('Calificación enviada exitosamente', 'success');
        
        document.getElementById('formCalificacion').reset();
        document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
        
        this.inicializar();
    }

    aplicarFiltro() {
        let calificaciones = this.calificacionModel.obtenerTodas();
        
        if (this.filtroActual !== 'todas') {
            calificaciones = this.calificacionModel.obtenerPorEstado(this.filtroActual);
        }

        this.view.actualizarTabla(calificaciones);
        this.view.actualizarEventos(calificaciones);
        this.configurarEventos();
    }

    verDetalle(id) {
        const calificacion = this.calificacionModel.visualizar(id, this.usuarioModel.usuarioActual?.id || 1);
        
        if (calificacion) {
            alert(`
                Detalle de Calificación #${calificacion.id}
                
                Asesoría: Solicitud #${calificacion.solicitudId}
                Puntuación: ${'★'.repeat(calificacion.puntuacion)}${'☆'.repeat(5 - calificacion.puntuacion)}
                Estado: ${calificacion.estado}
                Comentario: ${calificacion.comentario || 'Sin comentario'}
                
                Creado: ${new Date(calificacion.fechaCreacion).toLocaleString()}
                Última actualización: ${new Date(calificacion.ultimaActualizacion).toLocaleString()}
            `);
        }
    }

    calcularResumen(calificaciones) {
        const total = calificaciones.length;
        const suma = calificaciones.reduce((acc, c) => acc + c.puntuacion, 0);
        const promedio = total > 0 ? suma / total : 0;
        
        return {
            promedioGeneral: promedio,
            totalCalificaciones: total,
            pendientes: calificaciones.filter(c => c.estado === 'pendiente').length,
            resueltas: calificaciones.filter(c => c.estado === 'resuelto').length
        };
    }
}