class App {
    constructor() {
        // Inicializar modelos
        this.usuarioModel = new UsuarioModel();
        this.proyectoModel = new ProyectoModel();
        this.servicioModel = new ServicioModel();
        this.hitoModel = new HitoModel();
        this.rolModel = new RolModel();
        this.tareaModel = new TareaModel();
        this.asignacionModel = new AsignacionModel();
        this.calificacionModel = new CalificacionModel(); 

        // Inicializar controladores
        this.dashboardController = new DashboardController(
            this.usuarioModel,
            this.proyectoModel,
            this.servicioModel
        );
        this.proyectosController = new ProyectosController(
            this.proyectoModel,
            this.hitoModel
        );
        this.serviciosController = new ServiciosController(this.servicioModel);
        this.perfilController = new PerfilController(this.usuarioModel);
        this.rolesController = new RolesController(
            this.rolModel,
            this.usuarioModel,
            this.proyectoModel,
            this.asignacionModel,
            this.tareaModel
        );
        this.tareasController = new TareasController(
            this.tareaModel,
            this.usuarioModel,
            this.proyectoModel,
            this.rolModel
        );
        this.registroController = new RegistroController(this.usuarioModel);
        this.calificacionController = new CalificacionController( // NUEVO
            this.calificacionModel,
            this.servicioModel,
            this.usuarioModel
        );
        // Inicializar navegación
        this.seccionActual = 'inicio';
        this.inicializarNavegacion();
        this.dashboardController.inicializar();
    }

    inicializarNavegacion() {
        const links = document.querySelectorAll('.sidebar a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const seccion = link.dataset.section;
                this.navegarA(seccion);
                
                // Actualizar clases activas
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    navegarA(seccion) {
        // Ocultar todas las secciones
        document.querySelectorAll('.contenido').forEach(contenido => {
            contenido.style.display = 'none';
        });

        // Mostrar la sección seleccionada
        const seccionElement = document.getElementById(seccion);
        if (seccionElement) {
            seccionElement.style.display = 'block';
        }

        // Inicializar el controlador correspondiente
        switch(seccion) {
            case 'inicio':
                this.dashboardController.inicializar();
                break;
            case 'proyectos':
                this.proyectosController.inicializar();
                break;
            case 'roles':
                this.rolesController.inicializar();
                break;
            case 'tareas':
                this.tareasController.inicializar();
                break;
            case 'servicios':
                this.serviciosController.inicializar();
                break;
            case 'perfil':
                this.perfilController.inicializar();
                break;
            case 'registro':
                this.registroController.inicializar();
                break;
            case 'calificaciones': 
                this.calificacionController.inicializar();
                break;
        }


        this.seccionActual = seccion;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});