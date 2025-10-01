class RolModel {
    constructor() {
        this.roles = this.cargarRoles();
    }

    cargarRoles() {
        const rolesGuardados = localStorage.getItem('roles');
        return rolesGuardados ? JSON.parse(rolesGuardados) : [
            {
                id: 1,
                nombre: 'Desarrollador Frontend',
                descripcion: 'Responsable de la interfaz de usuario y experiencia del cliente',
                responsabilidades: [
                    'Crear interfaces responsivas',
                    'Implementar diseños UI/UX',
                    'Optimizar rendimiento del frontend'
                ],
                permisos: ['ver_proyectos', 'editar_codigo']
            },
            {
                id: 2,
                nombre: 'Desarrollador Backend',
                descripcion: 'Gestiona la lógica del servidor y bases de datos',
                responsabilidades: [
                    'Desarrollar APIs',
                    'Gestionar bases de datos',
                    'Implementar seguridad'
                ],
                permisos: ['ver_proyectos', 'editar_codigo', 'gestionar_db']
            },
            {
                id: 3,
                nombre: 'Project Manager',
                descripcion: 'Coordina el equipo y gestiona el proyecto',
                responsabilidades: [
                    'Planificar sprints',
                    'Coordinar equipo',
                    'Reportar progreso'
                ],
                permisos: ['ver_proyectos', 'asignar_tareas', 'ver_reportes']
            },
            {
                id: 4,
                nombre: 'QA Tester',
                descripcion: 'Asegura la calidad del software',
                responsabilidades: [
                    'Realizar pruebas',
                    'Reportar bugs',
                    'Validar funcionalidades'
                ],
                permisos: ['ver_proyectos', 'crear_tickets']
            }
        ];
    }

    guardarRoles() {
        localStorage.setItem('roles', JSON.stringify(this.roles));
    }

    obtenerTodos() {
        return this.roles;
    }

    obtenerPorId(id) {
        return this.roles.find(r => r.id === id);
    }

    agregar(rol) {
        const nuevoId = this.roles.length > 0 ? Math.max(...this.roles.map(r => r.id)) + 1 : 1;
        const nuevoRol = { id: nuevoId, ...rol };
        this.roles.push(nuevoRol);
        this.guardarRoles();
        return nuevoRol;
    }
}