class PerfilView {
    constructor() {
        this.container = document.getElementById('perfil');
    }

    render(usuario) {
        this.container.innerHTML = `
            <h1>Mi Perfil</h1>
            <div class="perfil-header">
                <div class="perfil-avatar"></div>
                <div class="perfil-info">
                    <h2>${usuario.nombre}</h2>
                    <p>${usuario.email}</p>
                    <p>${usuario.cargo}</p>
                </div>
            </div>
            
            <div class="perfil-section">
                <h3>Información Personal</h3>
                <div class="perfil-form">
                    <div class="form-row">
                        <div class="form-field">
                            <label>Nombre Completo</label>
                            <input type="text" id="perfilNombre" value="${usuario.nombre}">
                        </div>
                        <div class="form-field">
                            <label>Teléfono</label>
                            <input type="text" id="perfilTelefono" value="${usuario.telefono}">
                            <button class="edit-btn">Editar</button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label>Correo electrónico</label>
                            <input type="email" id="perfilEmail" value="${usuario.email}">
                        </div>
                        <div class="form-field">
                            <label>Ubicación</label>
                            <input type="text" value="${usuario.ubicacion}" readonly>
                        </div>
                    </div>
                    
                    <label for="roleSelect">Rol:</label>
                    <select id="roleSelect">
                        <option value="usuario" ${usuario.rol === 'usuario' ? 'selected' : ''}>Usuario</option>
                        <option value="admin" ${usuario.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                    
                    <div id="adminPanel" style="display:${usuario.rol === 'admin' ? 'block' : 'none'};">
                        <h3>Panel de Administración</h3>
                        <button>Activar edición</button>
                        <button>Revertir último cambio</button>
                        <button>Organizar secciones</button>
                    </div>
                </div>
            </div>
            
            <div class="perfil-section">
                <h3>Seguridad</h3>
                <button class="security-btn" id="btnCambiarPassword">Cambiar contraseña</button>
            </div>
            
            <div class="perfil-section">
                <h3>Estadísticas personales</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Proyectos completados</h4>
                        <div class="stat-number">${usuario.estadisticas.proyectosCompletados}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Eventos asistidos</h4>
                        <div class="stat-number">${usuario.estadisticas.eventosAsistidos}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Contribuciones</h4>
                        <div class="stat-number">${usuario.estadisticas.contribuciones}</div>
                    </div>
                </div>
            </div>
        `;
    }

    actualizarPanelAdmin(esAdmin) {
        const panel = document.getElementById('adminPanel');
        if (panel) {
            panel.style.display = esAdmin ? 'block' : 'none';
        }
    }
}