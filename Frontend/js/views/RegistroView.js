class RegistroView {
    constructor() {
        this.container = document.getElementById('registro');
    }

    render(data) {
        this.container.innerHTML = `
            <h1>Registro de Usuarios</h1>

            <!-- US-35.01: Diseñar formularios de registro -->
            <div class="perfil-section">
                <h3>Registrar Nuevo Usuario</h3>
                <form id="formRegistroUsuario" class="perfil-form">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="registroNombre">Nombre completo: *</label>
                            <input type="text" id="registroNombre" required placeholder="Ej: Juan Pérez">
                        </div>
                        <div class="form-field">
                            <label for="registroEmail">Correo electrónico: *</label>
                            <input type="email" id="registroEmail" required placeholder="ejemplo@correo.com">
                            <small style="color: #666; font-size: 12px;">El correo debe ser único</small>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="registroRol">Rol: *</label>
                            <select id="registroRol" required>
                                <option value="Usuario">Usuario</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Desarrollador">Desarrollador</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="registroEstado">Estado inicial:</label>
                            <select id="registroEstado">
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="registroPassword">Contraseña: *</label>
                            <input type="password" id="registroPassword" required>
                            <small style="color: #666; font-size: 12px;">Mínimo 8 caracteres, una mayúscula y un carácter especial</small>
                        </div>
                        <div class="form-field">
                            <label for="registroPasswordConfirm">Confirmar contraseña: *</label>
                            <input type="password" id="registroPasswordConfirm" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-agregar">Registrar Usuario</button>
                    <button type="reset" class="security-btn" style="background-color: #6c757d; margin-left: 10px;">Limpiar Formulario</button>
                </form>
            </div>

            <!-- US-35.03: Habilitar búsqueda rápida -->
            <div class="perfil-section">
                <h3>Búsqueda de Usuarios</h3>
                <div class="buscador">
                    <input type="text" id="buscadorUsuarios" placeholder="Buscar por nombre, correo, rol o estado...">
                </div>
            </div>

            <!-- US-35.04: Crear listado de usuarios con filtros -->
            <div class="perfil-section">
                <h3>Listado de Usuarios Registrados</h3>
                
                <div class="filtros-usuarios">
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Filtrar por Rol:</label>
                            <select id="filtroRol" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                                <option value="todos">Todos</option>
                                <option value="Usuario">Usuario</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Desarrollador">Desarrollador</option>
                            </select>
                        </div>
                        <div style="flex: 1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Filtrar por Estado:</label>
                            <select id="filtroEstado" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                                <option value="todos">Todos</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Fecha Registro</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaUsuariosRegistro">
                            ${this.renderUsuarios(data.usuarios, data.esAdmin)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style="background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <strong>Nota:</strong> El sistema valida automáticamente que no se registren correos duplicados.
            </div>
        `;
    }

    renderUsuarios(usuarios, esAdmin) {
        if (usuarios.length === 0) {
            return '<tr><td colspan="7" style="text-align: center;">No hay usuarios registrados</td></tr>';
        }

        return usuarios.map(u => {
            const fecha = u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString() : 'N/A';
            const estadoClass = u.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo';
            
            return `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.nombre}</td>
                    <td>${u.email || 'N/A'}</td>
                    <td><span class="rol-badge">${u.rol}</span></td>
                    <td><span class="estado-badge ${estadoClass}">${u.estado}</span></td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn-toggle-estado" data-usuario-id="${u.id}" ${!esAdmin ? 'disabled' : ''}>
                            ${u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                        </button>
                    </td>
                    <td>
                    <button class="btn-toggle-estado" data-usuario-id="${u.id}" ${!esAdmin ? 'disabled' : ''}>
                    ${u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button class="btn-eliminar-usuario" data-usuario-id="${u.id}" ${!esAdmin ? 'disabled' : ''} style="margin-left:5px; background-color:#dc3545; color:white;">
                    Eliminar
                    </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    actualizarTabla(usuarios, esAdmin) {
        const tbody = document.getElementById('tablaUsuariosRegistro');
        if (tbody) {
            tbody.innerHTML = this.renderUsuarios(usuarios, esAdmin);
        }
    }

    mostrarMensaje(mensaje, tipo = 'success') {
        const colores = {
            success: '#d4edda',
            error: '#f8d7da',
            warning: '#fff3cd'
        };

        const borderColors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107'
        };

        const mensajeDiv = document.createElement('div');
        mensajeDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo]};
            border-left: 4px solid ${borderColors[tipo]};
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        mensajeDiv.innerHTML = `<strong>${mensaje}</strong>`;

        document.body.appendChild(mensajeDiv);

        setTimeout(() => {
            mensajeDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => mensajeDiv.remove(), 300);
        }, 3000);
    }
}