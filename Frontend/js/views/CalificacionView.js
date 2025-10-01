class CalificacionView {
    constructor() {
        this.container = document.getElementById('calificaciones');
    }

    render(data) {
        this.container.innerHTML = `
            <h1>Calificación de Asesorías</h1>

            <!-- US-60.01: Mostrar formulario solo a usuarios que asistieron -->
            ${data.esUsuarioAutorizado ? `
                <div class="perfil-section">
                    <h3>Calificar Asesoría</h3>
                    <p style="color: #666; margin-bottom: 20px;">
                        Solo los usuarios que asistieron a una asesoría pueden calificarla.
                    </p>
                    <form id="formCalificacion">
                        <div class="form-row">
                            <div class="form-field">
                                <label for="solicitudCalificacion">Selecciona la asesoría: *</label>
                                <select id="solicitudCalificacion" required>
                                    <option value="">-- Selecciona una asesoría --</option>
                                    ${data.solicitudesUsuario.map(s => `
                                        <option value="${s.id}">
                                            ${s.tipo} - ${s.fecha} ${s.hora}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-field">
                                <label for="puntuacion">Puntuación: *</label>
                                <div class="rating-input" id="ratingInput">
                                    <span class="star" data-value="1">★</span>
                                    <span class="star" data-value="2">★</span>
                                    <span class="star" data-value="3">★</span>
                                    <span class="star" data-value="4">★</span>
                                    <span class="star" data-value="5">★</span>
                                </div>
                                <input type="hidden" id="puntuacion" required>
                            </div>
                        </div>
                        <div class="form-field">
                            <label for="comentario">Comentario:</label>
                            <textarea id="comentario" rows="4" placeholder="Comparte tu experiencia..."></textarea>
                        </div>
                        <button type="submit" class="btn-agregar">Enviar Calificación</button>
                    </form>
                </div>
            ` : `
                <div class="alert-warning">
                    ⚠️ Solo los usuarios que han asistido a asesorías pueden calificarlas.
                </div>
            `}

            <!-- US-60.04: Ver estado de solicitudes -->
            <div class="perfil-section">
                <h3>Mis Calificaciones</h3>
                <div class="filtros">
                    <button data-filtro="todas">Todas</button>
                    <button data-filtro="pendiente">Pendientes</button>
                    <button data-filtro="en_proceso">En Proceso</button>
                    <button data-filtro="resuelto">Resueltas</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Asesoría</th>
                                <th>Puntuación</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCalificaciones">
                            ${this.renderCalificaciones(data.calificaciones)}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- US-60.05: Visualizar resumen del centro -->
            <div class="perfil-section">
                <h3>Resumen de Calificaciones del Centro</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Promedio General</h4>
                        <div class="stat-number">${data.resumen.promedioGeneral.toFixed(1)} ★</div>
                    </div>
                    <div class="stat-card">
                        <h4>Total Calificaciones</h4>
                        <div class="stat-number">${data.resumen.totalCalificaciones}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Pendientes</h4>
                        <div class="stat-number">${data.resumen.pendientes}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Resueltas</h4>
                        <div class="stat-number">${data.resumen.resueltas}</div>
                    </div>
                </div>
            </div>

            <!-- US-60.03: Incluir fecha de creación y última actualización -->
            <!-- US-60.05: Lista de eventos (calificaciones) -->
            <div class="perfil-section">
                <h3>Lista de Eventos de Calificación</h3>
                <div id="listaEventos">
                    ${this.renderEventos(data.calificaciones)}
                </div>
            </div>
        `;

        this.configurarEstrellas();
    }

    renderCalificaciones(calificaciones) {
        if (calificaciones.length === 0) {
            return '<tr><td colspan="6" style="text-align:center; padding: 40px;">No hay calificaciones aún</td></tr>';
        }

        return calificaciones.map(c => {
            const estadoClass = c.estado === 'resuelto' ? 'estado-activo' : 
                              c.estado === 'en_proceso' ? 'estado-warning' : 'estado-inactivo';
            const estrellas = '★'.repeat(c.puntuacion) + '☆'.repeat(5 - c.puntuacion);
            
            return `
                <tr>
                    <td>${c.id}</td>
                    <td>Solicitud #${c.solicitudId}</td>
                    <td><span style="color: #ffc107; font-size: 18px;">${estrellas}</span></td>
                    <td><span class="estado-badge ${estadoClass}">${c.estado}</span></td>
                    <td>${new Date(c.fechaCreacion).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-ver-detalle" data-calificacion-id="${c.id}">Ver</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderEventos(calificaciones) {
        if (calificaciones.length === 0) {
            return '<p style="text-align:center; color: #666;">No hay eventos registrados</p>';
        }

        return calificaciones.map(c => {
            const fecha = new Date(c.fechaCreacion).toLocaleString();
            const ultimaAct = new Date(c.ultimaActualizacion).toLocaleString();
            
            return `
                <div class="evento-card">
                    <div class="evento-header">
                        <span class="evento-id">#${c.id}</span>
                        <span class="evento-estado ${c.estado}">${c.estado}</span>
                    </div>
                    <div class="evento-body">
                        <p><strong>Asesoría:</strong> Solicitud #${c.solicitudId}</p>
                        <p><strong>Puntuación:</strong> ${'★'.repeat(c.puntuacion)}${'☆'.repeat(5 - c.puntuacion)}</p>
                        <p><strong>Comentario:</strong> ${c.comentario || 'Sin comentario'}</p>
                        <p><strong>Ubicación:</strong> ${c.lugar || 'No especificado'}</p>
                    </div>
                    <div class="evento-footer">
                        <small>📅 Creado: ${fecha}</small>
                        <small>🔄 Actualizado: ${ultimaAct}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    configurarEstrellas() {
        const stars = document.querySelectorAll('.star');
        const input = document.getElementById('puntuacion');
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                input.value = value;
                
                stars.forEach(s => {
                    if (s.dataset.value <= value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    actualizarTabla(calificaciones) {
        const tbody = document.getElementById('tablaCalificaciones');
        if (tbody) {
            tbody.innerHTML = this.renderCalificaciones(calificaciones);
        }
    }

    actualizarEventos(calificaciones) {
        const lista = document.getElementById('listaEventos');
        if (lista) {
            lista.innerHTML = this.renderEventos(calificaciones);
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
        `;
        mensajeDiv.textContent = mensaje;

        document.body.appendChild(mensajeDiv);

        setTimeout(() => mensajeDiv.remove(), 3000);
    }
}