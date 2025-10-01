class RolesView {
    constructor() {
        this.container = document.getElementById('roles');
    }

    render(data) {
        this.container.innerHTML = `
            <h1>Gestión de Roles y Asignaciones</h1>
            
            <!-- US-34.07: Solo administradores pueden asignar -->
            ${!data.esAdmin ? `
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                    <strong>⚠️ Acceso restringido:</strong> Solo los administradores pueden asignar roles y tareas.
                </div>
            ` : ''}

            <!-- US-34.01: Interfaz de asignación de roles -->
            <div class="perfil-section">
                <h3>Asignar Rol a Usuario</h3>
                <div class="perfil-form">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="usuarioSelect">Usuario:</label>
                            <select id="usuarioSelect" ${!data.esAdmin ? 'disabled' : ''}>
                                <option value="">Seleccione un usuario...</option>
                                ${data.usuarios.map(u => `
                                    <option value="${u.id}">${u.nombre} - ${u.rol}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="rolSelect">Rol:</label>
                            <select id="rolSelect" ${!data.esAdmin ? 'disabled' : ''}>
                                <option value="">Seleccione un rol...</option>
                                ${data.roles.map(r => `
                                    <option value="${r.id}">${r.nombre}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="proyectoSelect">Proyecto:</label>
                            <select id="proyectoSelect" ${!data.esAdmin ? 'disabled' : ''}>
                                <option value="">Seleccione un proyecto...</option>
                                ${data.proyectos.map(p => `
                                    <option value="${p.id}">${p.nombre}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    <button class="btn-agregar" id="btnAsignarRol" ${!data.esAdmin ? 'disabled' : ''}>
                        Asignar Rol
                    </button>
                </div>
            </div>

            <!-- US-34.04: Definición clara de responsabilidades -->
            <div class="perfil-section">
                <h3>Roles Disponibles y sus Responsabilidades</h3>
                <div class="roles-grid">
                    ${data.roles.map(rol => `
                        <div class="rol-card">
                            <h4>${rol.nombre}</h4>
                            <p class="rol-descripcion">${rol.descripcion}</p>
                            <div class="rol-responsabilidades">
                                <strong>Responsabilidades:</strong>
                                <ul>
                                    ${rol.responsabilidades.map(r => `<li>${r}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="rol-permisos">
                                <strong>Permisos:</strong>
                                ${rol.permisos.map(p => `<span class="permiso-badge">${p}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- US-34.02: Sección de participantes -->
            <div class="perfil-section">
                <h3>Participantes por Proyecto</h3>
                <div class="filtros" style="margin-bottom: 15px;">
                    <select id="filtroProyectoParticipantes" style="padding: 10px; border-radius: 8px; border: 1px solid #ccc; width: 100%;">
                        <option value="">Todos los proyectos</option>
                        ${data.proyectos.map(p => `
                            <option value="${p.id}">${p.nombre}</option>
                        `).join('')}
                    </select>
                </div>
                <div id="participantesContainer">
                    ${this.renderParticipantes(data.asignaciones, data.usuarios, data.roles, data.proyectos)}
                </div>
            </div>

            <div class="perfil-section">
                <h3>Resumen de Asignaciones Actuales</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol Asignado</th>
                                <th>Proyecto</th>
                                <th>Fecha de Asignación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaAsignaciones">
                            ${this.renderTablaAsignaciones(data.asignaciones, data.usuarios, data.roles, data.proyectos, data.esAdmin)}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- US-34.06: Seguimiento de cumplimiento por rol -->
            <div class="perfil-section">
                <h3>Métricas de Cumplimiento por Rol</h3>
                <div class="stats-grid">
                    ${data.roles.map(rol => {
                        const stats = data.estadisticasPorRol[rol.id] || { total: 0, completadas: 0, porcentaje: 0 };
                        return `
                            <div class="stat-card">
                                <h4>${rol.nombre}</h4>
                                <div class="stat-number">${stats.porcentaje}%</div>
                                <p style="font-size: 14px; color: #666; margin-top: 10px;">
                                    ${stats.completadas} de ${stats.total} tareas completadas
                                </p>
                                <div class="progress-line" style="margin-top: 10px;">
                                    <span style="width: ${stats.porcentaje}%"></span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderParticipantes(asignaciones, usuarios, roles, proyectos) {
        if (asignaciones.length === 0) {
            return '<p style="text-align: center; color: #666;">No hay participantes asignados aún.</p>';
        }

        const proyectosConParticipantes = {};
        
        asignaciones.forEach(asig => {
            if (!proyectosConParticipantes[asig.proyectoId]) {
                proyectosConParticipantes[asig.proyectoId] = [];
            }
            proyectosConParticipantes[asig.proyectoId].push(asig);
        });

        return Object.keys(proyectosConParticipantes).map(proyectoId => {
            const proyecto = proyectos.find(p => p.id == proyectoId);
            const participantes = proyectosConParticipantes[proyectoId];

            return `
                <div class="proyecto-participantes" data-proyecto-id="${proyectoId}">
                    <h4 style="color: #4a5d9a; margin-bottom: 10px;">${proyecto ? proyecto.nombre : 'Proyecto Desconocido'}</h4>
                    <div class="participantes-list">
                        ${participantes.map(asig => {
                            const usuario = usuarios.find(u => u.id === asig.usuarioId);
                            const rol = roles.find(r => r.id === asig.rolId);
                            return `
                                <div class="participante-item">
                                    <div class="participante-avatar">${usuario ? usuario.nombre.charAt(0) : '?'}</div>
                                    <div class="participante-info">
                                        <strong>${usuario ? usuario.nombre : 'Usuario Desconocido'}</strong>
                                        <span>${rol ? rol.nombre : 'Sin rol'}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderTablaAsignaciones(asignaciones, usuarios, roles, proyectos, esAdmin) {
        if (asignaciones.length === 0) {
            return '<tr><td colspan="5" style="text-align: center;">No hay asignaciones registradas</td></tr>';
        }

        return asignaciones.map(asig => {
            const usuario = usuarios.find(u => u.id === asig.usuarioId);
            const rol = roles.find(r => r.id === asig.rolId);
            const proyecto = proyectos.find(p => p.id === asig.proyectoId);
            const fecha = new Date(asig.fechaAsignacion).toLocaleDateString();

            return `
                <tr>
                    <td>${usuario ? usuario.nombre : 'Desconocido'}</td>
                    <td>${rol ? rol.nombre : 'Sin rol'}</td>
                    <td>${proyecto ? proyecto.nombre : 'Sin proyecto'}</td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn-delete" data-asignacion-id="${asig.id}" ${!esAdmin ? 'disabled' : ''}>
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    actualizarParticipantes(asignaciones, usuarios, roles, proyectos, filtroProyecto = '') {
        const container = document.getElementById('participantesContainer');
        if (!container) return;

        let asignacionesFiltradas = asignaciones;
        if (filtroProyecto) {
            asignacionesFiltradas = asignaciones.filter(a => a.proyectoId == filtroProyecto);
        }

        container.innerHTML = this.renderParticipantes(asignacionesFiltradas, usuarios, roles, proyectos);
    }

    actualizarTablaAsignaciones(asignaciones, usuarios, roles, proyectos, esAdmin) {
        const tbody = document.getElementById('tablaAsignaciones');
        if (!tbody) return;
        tbody.innerHTML = this.renderTablaAsignaciones(asignaciones, usuarios, roles, proyectos, esAdmin);
    }
}