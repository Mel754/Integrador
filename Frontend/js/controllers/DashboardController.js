class DashboardController {
    constructor(usuarioModel, proyectoModel, servicioModel) {
        this.usuarioModel = usuarioModel;
        this.proyectoModel = proyectoModel;
        this.servicioModel = servicioModel;
        this.view = new DashboardView();
    }

    inicializar() {
        this.renderizar();
        this.configurarEventos();
    }

    renderizar() {
        const data = {
            proyectosActivos: this.proyectoModel.contarActivos(),
            usuariosTotales: this.usuarioModel.contarTotal(),
            servicios: this.servicioModel.contarServicios(),
            usuarios: this.usuarioModel.obtenerTodos()
        };
        this.view.render(data);
    }

    configurarEventos() {
        // Eventos de actividad
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const actividad = e.currentTarget.dataset.activity;
                alert(`Mostrando detalles de: ${actividad}`);
            });
        });

        // Botones de acceso rápido
        const btnVerProyectos = document.getElementById('btnVerProyectos');
        const btnCrearProyecto = document.getElementById('btnCrearProyecto');

        if (btnVerProyectos) {
            btnVerProyectos.addEventListener('click', () => {
                window.app.navegarA('proyectos');
            });
        }

        if (btnCrearProyecto) {
            btnCrearProyecto.addEventListener('click', () => {
                window.app.navegarA('proyectos');
            });
        }
    }
}