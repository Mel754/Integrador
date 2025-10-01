class ProyectosView {
    constructor() {
        this.container = document.getElementById('proyectos');
    }

    render(proyectos) {
        const tablaHTML = this.renderProyectosTabla(proyectos);
        
        this.container.innerHTML = `
            <h1>Gestión de Proyectos</h1>
            <div class="filtros">
                <button data-filtro="Todos">Todos</button>
                <button data-filtro="Activos">Activos</button>
                <button data-filtro="Pendientes">Pendientes</button>
            </div>
            
            <div class="buscador">
                <input type="text" id="buscadorProyectos" placeholder="Buscar por nombre, descripción o miembro del equipo">
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del proyecto</th>
                            <th>Estado</th>
                            <th>Miembros del equipo</th>
                            <th>Fecha Estimada</th>
                            <th>Progreso</th>
                        </tr>
                    </thead>
                    <tbody id="tablaProyectos">
                        ${tablaHTML}
                    </tbody>
                </table>
            </div>
            <h2>Crear nuevo Proyecto:</h2>
            <div class="form-proyecto">
                <div class="form-box">
                    <h3>Información Básica</h3>
                    <label>Nombre del Proyecto</label>
                    <input type="text" id="nombreProyecto">
                    <label>Descripción</label>
                    <textarea id="descripcionProyecto"></textarea>
                    <label>Fecha de inicio</label>
                    <input type="date" id="fechaInicioProyecto">
                    <label>Fecha Fin estimada</label>
                    <input type="date" id="fechaFinProyecto">        
                </div>
                <div class="form-box">
                    <h3>Líder del Equipo</h3>
                    <label>Selecciona el líder del proyecto</label>
                    <select id="liderProyecto">
                        <option value="">-- Selecciona un líder --</option>
                    </select>
                    <select id="miembrosProyecto" multiple>
                    </select>
                </div>
            </div>
            <button type="button" class="btn-agregar" id="btnCrearProyecto">Crear Proyecto</button>
            <hr>
            
            <h2>Proyecto - Diagrama de Gantt</h2>
            <div class="form-hito">
                <h3>Agregar nuevo Hito</h3>
                <form id="hitoForm">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="proyectoHito">Proyecto asociado:</label>
                            <select id="proyectoHito" required></select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="nombreHito">Nombre del Hito:</label>
                            <input type="text" id="nombreHito" placeholder="Ej: Definir requisitos" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="fechaInicioHito">Fecha de Inicio:</label>
                            <input type="date" id="fechaInicioHito" required>
                        </div>
                        <div class="form-field">
                            <label for="fechaFinHito">Fecha de Fin:</label>
                            <input type="date" id="fechaFinHito" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label for="estadoHito">Estado del Hito:</label>
                            <select id="estadoHito">
                                <option value="Pendiente">Pendiente</option>
                                <option value="Progreso">En Progreso</option>
                                <option value="Completado">Completado</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="btn-agregar">Agregar Hito</button>
                </form>
            </div>
            
            <div class="gantt-container">
                <div class="gantt-chart" id="ganttChart">
                    <div class="gantt-header">
                        <div class="gantt-task-header">Hitos del Proyecto</div>
                        <div class="gantt-dates-header" id="datesHeader"></div>
                    </div>
                </div>
                <div id="ganttBody"></div>
            </div>
        `;
    }
    renderProyectosDetallados(proyectos) {
        const tbody = document.getElementById('tablaProyectosDetallados');
        if (!tbody) {
            console.error('Nada');
            return;
        }
        if (proyectos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay proyectos detallados</td></tr>`;
            return;
        }
        tbody.innerHTML = proyectos.map(p => `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.fechaInicio || 'Sin fecha'}</td>
                <td>${p.fechaFin || p.fechaEstimada || 'Sin fecha'}</td>
                <td>${p.estado}</td>
                <td>${p.descripcion || 'Sin descripción'}</td>
                <td>${p.lider || 'Sin líder'}</td>
            </tr>
        `).join('');
        console.log('Proyectos detallados renderizados, proyectos.length');
    }
    renderProyectosTabla(proyectos) {
        if (proyectos.length === 0) {
            return '<tr><td colspan="5" style="text-align:center;">No hay proyectos registrados</td></tr>';
        }

        return proyectos.map(p => {

            let miembrosText = 'Sin miembros';
            if (p.miembros) {
                if (Array.isArray(p.miembros)) {
                    miembrosText = p.miembros.join(', ');
                } else if (typeof p.miembros === 'string') {
                    miembrosText = p.miembros;
                }
            }
            const progreso = p.progreso || 0;
            return `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.estado}</td>
                    <td>${miembrosText}</td>
                    <td>${p.fechaEstimada || 'Sin fecha'}</td>
                    <td>
                        <div class="progress-line">
                            <span style="width:${progreso}%"></span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
    actualizarTablaProyectos(proyectos) {
        const tbody = document.getElementById('tablaProyectos');
        if (tbody) {
            tbody.innerHTML = this.renderProyectosTabla(proyectos);
        }
    }
    cargarUsuariosEnSelect(usuarios) {
        const select = document.getElementById('miembrosProyecto');
        select.innerHTML = ''; 
        usuarios.forEach(u => {
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = u.nombre;
            select.appendChild(option);
        });
        
        const selectLider = document.getElementById('liderProyecto');
        selectLider.innerHTML = '<option value="">-- Selecciona un líder --</option>';
        usuarios.forEach(u => {
            const option = document.createElement('option');
            option.value = u.nombre; 
            option.textContent = u.nombre;
            selectLider.appendChild(option);
        });
    }
    renderGantt(hitos) {
        const datesHeader = document.getElementById('datesHeader');
        const ganttBody = document.getElementById('ganttBody');
        
        if (!datesHeader || !ganttBody) return;

        if (hitos.length === 0) {
            datesHeader.innerHTML = '<div class="gantt-date" style="flex: 1; text-align: center;">No hay fechas</div>';
            ganttBody.innerHTML = `
                <div class="gantt-row" style="justify-content: center; padding: 40px;">
                    <span style="font-style: italic; color: #666;">
                        No hay hitos agregados aún. Utiliza el formulario para agregar el primer hito.
                    </span>
                </div>
            `;
            return;
        }

        const fechas = hitos.flatMap(h => [h.inicio, h.fin]);
        const fechaMinima = new Date(Math.min(...fechas.map(f => new Date(f))));
        const fechaMaxima = new Date(Math.max(...fechas.map(f => new Date(f))));
        
        const fechasProyecto = this.generarFechas(fechaMinima, fechaMaxima);
        
        datesHeader.innerHTML = fechasProyecto.map(fecha => 
            `<div class="gantt-date">${this.formatearFecha(fecha)}</div>`
        ).join('');

        ganttBody.innerHTML = hitos.map(hito => {
            const posicion = this.calcularPosicion(hito.inicio, hito.fin, fechaMinima, fechaMaxima);
            const duracion = Math.ceil((new Date(hito.fin) - new Date(hito.inicio)) / (1000 * 60 * 60 * 24)) + 1;
            
            const gridLines = fechasProyecto.map((fecha, index) => 
                `<div class="gantt-grid-line" style="left: ${(index / (fechasProyecto.length - 1)) * 100}%"></div>`
            ).join('');
            
            return `
                <div class="gantt-row">
                    <div class="gantt-task-name">
                        <span>${hito.nombre}</span>
                        <div class="gantt-actions">
                            <button class="btn-edit" data-hito-id="${hito.id}">✏️</button>
                            <button class="btn-delete" data-hito-id="${hito.id}">🗑️</button>
                        </div>
                    </div>
                    <div class="gantt-timeline">
                        ${gridLines}
                        <div class="gantt-bar estado-${hito.estado}" 
                             style="left: ${posicion.left}%; width: ${posicion.width}%">
                            ${duracion}d
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    generarFechas(fechaInicio, fechaFin) {
        const fechas = [];
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
            fechas.push(new Date(d));
        }
        return fechas;
    }
    formatearFecha(fecha) {
        const dia = fecha.getDate().toString().padStart(2, '0');
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return `${dia}-${meses[fecha.getMonth()]}`;
    }
    calcularPosicion(fechaInicio, fechaFin, fechaInicioProyecto, fechaFinProyecto) {
        const totalDias = (new Date(fechaFinProyecto) - new Date(fechaInicioProyecto)) / (1000 * 60 * 60 * 24);
        const diasDesdeInicio = (new Date(fechaInicio) - new Date(fechaInicioProyecto)) / (1000 * 60 * 60 * 24);
        const duracion = (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24) + 1;
        
        const left = (diasDesdeInicio / totalDias) * 100;
        const width = (duracion / totalDias) * 100;
        
        return { left, width };
    }
    mostrarModalEditarHito(hito) {
        const modal = document.getElementById('modal-editar-hito');
        if (modal) {
            document.getElementById('editNombreHito').value = hito.nombre;
            document.getElementById('editProyecto').value = hito.proyecto || 'Proyecto 1';
            document.getElementById('editFechaInicio').value = hito.inicio;
            document.getElementById('editFechaFin').value = hito.fin;
            document.getElementById('editEstadoHito').value = hito.estado;
            modal.style.display = 'flex';
        }
    }
    cargarProyectosEnSelect(proyectos) {
    const select = document.getElementById('proyectoHito');
    if (!select) return;
    select.innerHTML = '<option value="">-- Selecciona un proyecto --</option>';
    proyectos.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;   // Guardamos el id para relacionarlo
        option.textContent = p.nombre;
        select.appendChild(option);
    });

    const selectEdit = document.getElementById('editProyecto');
    if (selectEdit) {
        selectEdit.innerHTML = '<option value="">-- Selecciona un proyecto --</option>';
        proyectos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nombre;
            selectEdit.appendChild(option);
        });
    }
}
}