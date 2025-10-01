class TareasView {
    constructor() {
        this.container = document.getElementById('tareas');
    }

    render(data) {
        this.container.innerHTML = `
            <h1>Gestión de Tareas</h1>

            <!-- US-34.03: Configurar asignación de tareas específicas -->
            <div class="perfil-section">
                <h3>Asignar Nueva Tarea</h3>
                <form id="formNuevaTarea" class="perfil-form">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="tituloTarea">Título de la tarea:</label>
                            <input type="text" id="tituloTarea" required ${!data.esAdmin ? 'disabled' : ''}>
                        </div>
                        <div class="form-field">
                            <label for="proyectoTarea">Proyecto:</label>
                            <select id="proyectoTarea" required ${!data.esAdmin ? 'disabled' : ''}>
                                <option value="">Seleccione...</option>
                                ${data.proyectos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="usuarioTarea">Asignado a:</label>
                            <select id="usuarioTarea" required ${!data.esAdmin ? 'disabled' : ''}>
                                <option value="">Seleccione...</option>
                                ${data.usuarios.map(u => `<option value="${u.id}">${u.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="rolTarea">Rol:</label>
                            <select id="rolTarea" required ${!data.esAdmin ? 'disabled' : ''}>
                                <option value="">Seleccione...</option>
                                ${data.roles.map(r => `<option value="${r.nombre}">${r.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="prioridadTarea">Prioridad:</label>
                            <select id="prioridadTarea" ${!data.esAdmin ? 'disabled' : ''}>
                                <option value="baja">Baja</option>
                                <option value="media" selected>Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-field">
                        <label for="descripcionTarea">Descripción:</label>
                        <textarea id="descripcionTarea" rows="3" required ${!data.esAdmin ? 'disabled' : ''}></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="fechaInicioTarea">Fecha inicio:</label>
                            <input type="date" id="fechaInicioTarea" required ${!data.esAdmin ? 'disabled' : ''}>
                        </div>
                        <div class="form-field">
                            <label for="fechaFinTarea">Fecha fin:</label>
                            <input type="date" id="fechaFinTarea" required ${!data.esAdmin ? 'disabled' : ''}>
                        </div>
                    </div>
                    <button type="submit" class="btn-agregar" ${!data.esAdmin ? 'disabled' : ''}>Crear Tarea</button>
                </form>
            </div>

            <!-- Lista de Tareas -->
            <div class="perfil-section">
                <h3>Tareas Asignadas</h3>
                <div class="filtros">
                    <button data-filtro="todas">Todas</button>
                    <button data-filtro="pendiente">Pendientes</button>
                    <button data-filtro="en_progreso">En Progreso</button>
                    <button data-filtro="completada">Completadas</button>
                </div>
                <div id="listaTareas">
                    ${this.renderTareas(data.tareas, data.usuarios, data.proyectos, data.esAdmin)}
                </div>
            </div>
        `;
    }

    renderTareas(tareas, usuarios, proyectos, esAdmin) {
        if (tareas.length === 0) {
            return '<p style="text-align: center; color: #666; padding: 20px;">No hay tareas asignadas aún.</p>';
        }

        return tareas.map(tarea => {
            const usuario = usuarios.find(u => u.id === tarea.asignadoA);
            const proyecto = proyectos.find(p => p.id === tarea.proyectoId);
            const prioridadColor = {
                'baja': '#28a745',
                'media': '#ffc107',
                'alta': '#dc3545'
            };

            return `
                <div class="tarea-card" data-estado="${tarea.estado}">
                    <div class="tarea-header">
                        <h4>${tarea.titulo}</h4>
                        <span class="prioridad-badge" style="background: ${prioridadColor[tarea.prioridad]}">
                            ${tarea.prioridad.toUpperCase()}
                        </span>
                    </div>
                    <p>${tarea.descripcion}</p>
                    <div class="tarea-info">
                        <span><strong>Proyecto:</strong> ${proyecto ? proyecto.nombre : 'N/A'}</span>
                        <span><strong>Asignado a:</strong> ${usuario ? usuario.nombre : 'N/A'}</span>
                        <span><strong>Rol:</strong> ${tarea.rol}</span>
                    </div>
                    <div class="tarea-fechas">
                        <span>📅 ${new Date(tarea.fechaInicio).toLocaleDateString()} - ${new Date(tarea.fechaFin).toLocaleDateString()}</span>
                    </div>
                    <div class="tarea-acciones">
                        <select class="tarea-estado-select" data-tarea-id="${tarea.id}" ${!esAdmin ? 'disabled' : ''}>
                            <option value="pendiente" ${tarea.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="en_progreso" ${tarea.estado === 'en_progreso' ? 'selected' : ''}>En Progreso</option>
                            <option value="completada" ${tarea.estado === 'completada' ? 'selected' : ''}>Completada</option>
                        </select>
                        <button class="btn-delete-tarea" data-tarea-id="${tarea.id}" ${!esAdmin ? 'disabled' : ''}>Eliminar</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    actualizarTareas(tareas, usuarios, proyectos, esAdmin, filtro = 'todas') {
        let tareasFiltradas = tareas;
        if (filtro !== 'todas') {
            tareasFiltradas = tareas.filter(t => t.estado === filtro);
        }
        const container = document.getElementById('listaTareas');
        if (container) {
            container.innerHTML = this.renderTareas(tareasFiltradas, usuarios, proyectos, esAdmin);
        }
    }
}