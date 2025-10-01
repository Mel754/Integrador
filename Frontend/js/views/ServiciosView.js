class ServiciosView {
    constructor() {
        this.container = document.getElementById('servicios');
    }

    render(solicitudes) {
        this.container.innerHTML = `
            <h1>Gestión de Servicios</h1>
            <div class="table-container">
                <table id="tablaSolicitudes">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tipo</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Registrado el</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderSolicitudes(solicitudes)}
                    </tbody>
                </table>
            </div>
            
            <div class="servicio-card">
                <h3>Solicitar Asesoría</h3>
                <p>Selecciona fecha, hora y tema de tu asesoría. Adjunta una descripción breve de tu necesidad.</p>
                <button id="btnAbrirAsesoria">Solicitar</button>
            </div>
            
            <div class="servicio-card">
                <h3>Solicitar Consultoría</h3>
                <p>Adjunta documentos necesarios y genera un número de seguimiento automático para tu solicitud.</p>
                <button id="btnAbrirConsultoria">Solicitar</button>
            </div>
            
            <div class="servicio-card">
                <h3>Ver Estado de Solicitudes</h3>
                <p>Revisa el estado actualizado de tus solicitudes: "pendiente", "en proceso" o "resuelto".</p>
                <button id="btnVerSolicitudes">Ver Estado</button>
            </div>
        `;
    }

    renderSolicitudes(solicitudes) {
        if (solicitudes.length === 0) {
            return '<tr><td colspan="6" style="text-align:center;">No hay solicitudes registradas</td></tr>';
        }
        return solicitudes.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.tipo}</td>
                <td>${s.fecha}</td>
                <td>${s.hora}</td>
                <td>${s.estado}</td>
                <td>${s.registradoEl}</td>
            </tr>
        `).join('');
    }

    actualizarTablaSolicitudes(solicitudes) {
        const tbody = document.querySelector('#tablaSolicitudes tbody');
        if (tbody) {
            tbody.innerHTML = this.renderSolicitudes(solicitudes);
        }
    }
}