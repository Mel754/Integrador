class DashboardView {
    constructor() {
        this.container = document.getElementById('inicio');
    }

    render(data) {
        this.container.innerHTML = `
            <h1>Panel de control</h1>
            <div class="cards">
                <div class="card">
                    <h2>${data.proyectosActivos}</h2>
                    <p>Proyectos Activos</p>
                </div>
                <div class="card">
                    <h2>${data.usuariosTotales}</h2>
                    <p>Usuarios Totales</p>
                </div>
                <div class="card">
                    <h2>${data.servicios}</h2>
                    <p>Servicios</p>
                </div>
            </div>
            
            <h2>Gestión de usuarios</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>Nombre</th><th>Rol</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        ${data.usuarios.map(u => `
                            <tr>
                                <td>${u.nombre}</td>
                                <td>${u.rol}</td>
                                <td>${u.estado}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    </table>
            </div>
            
            <div class="section">
                <div class="activity">
                    <h2>Actividad reciente</h2>
                    <div class="activity-item" data-activity="Nuevo proyecto creado">
                        <div class="activity-main">
                            <span class="activity-text">Nuevo proyecto creado</span>
                            <span class="activity-time">Hace 20 min</span>
                        </div>
                        <div class="activity-details">Ver detalles</div>
                    </div>
                    <div class="activity-item" data-activity="Nuevo usuario registrado">
                        <div class="activity-main">
                            <span class="activity-text">Nuevo usuario registrado</span>
                            <span class="activity-time">Hace 50 min</span>
                        </div>
                        <div class="activity-details">Ver detalles</div>
                    </div>
                    <div class="activity-item" data-activity="Servicio reservado">
                        <div class="activity-main">
                            <span class="activity-text">Nuevo servicio reservado</span>
                            <span class="activity-time">Hace 1 hora</span>
                        </div>
                        <div class="activity-details">Ver detalles</div>
                    </div>
                </div>
                
                <div class="quick-access">
                    <h2>Acceso rápido</h2>
                    <button id="btnVerProyectos">Ver proyectos</button>
                    <button id="btnCrearProyecto">Crear proyecto</button>
                </div>
            </div>
        `;
    }
}                