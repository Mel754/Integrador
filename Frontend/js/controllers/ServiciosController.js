class ServiciosController {
    constructor(servicioModel) {
        this.servicioModel = servicioModel;
        this.view = new ServiciosView();
    }

    inicializar() {
        this.renderizar();
        this.configurarEventos();
        this.crearModales();
    }

    renderizar() {
        const solicitudes = this.servicioModel.obtenerTodas();
        this.view.render(solicitudes);
    }

    configurarEventos() {
        const btnAsesoria = document.getElementById('btnAbrirAsesoria');
        const btnConsultoria = document.getElementById('btnAbrirConsultoria');
        const btnSolicitudes = document.getElementById('btnVerSolicitudes');

        if (btnAsesoria) {
            btnAsesoria.addEventListener('click', () => this.abrirModalAsesoria());
        }

        if (btnConsultoria) {
            btnConsultoria.addEventListener('click', () => this.abrirModalConsultoria());
        }

        if (btnSolicitudes) {
            btnSolicitudes.addEventListener('click', () => this.abrirModalSolicitudes());
        }
    }

    crearModales() {
        const modalContainer = document.getElementById('modales-container');
        const modalesHTML = `
            <!-- Modal Asesoría -->
            <div id="modal-asesoria" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="window.app.serviciosController.cerrarModalAsesoria()">&times;</span>
                    <h2>Solicitar Asesoría</h2>
                    <form id="formAsesoria">
                        <input type="date" id="fechaAsesoria" required>
                        <input type="time" id="horaAsesoria" required>
                        <input type="text" id="temaAsesoria" placeholder="Tema" required>
                        <textarea id="descripcionAsesoria" placeholder="Descripción" required></textarea>
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </div>

            <!-- Modal Consultoría -->
            <div id="modal-consultoria" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="window.app.serviciosController.cerrarModalConsultoria()">&times;</span>
                    <h2>Solicitar Consultoría</h2>
                    <form id="formConsultoria">
                        <input type="date" id="fechaConsultoria" required>
                        <input type="time" id="horaConsultoria" required>
                        <input type="text" id="documentosConsultoria" placeholder="Documentos necesarios" required>
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </div>

            <!-- Modal Ver Solicitudes -->
            <div id="modal-solicitudes" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="window.app.serviciosController.cerrarModalSolicitudes()">&times;</span>
                    <h2>Estado de Solicitudes</h2>
                    <div id="estadoSolicitudes">
                        <p>No hay solicitudes registradas aún.</p>
                    </div>
                </div>
            </div>
        `;
        modalContainer.innerHTML += modalesHTML;

        // Eventos de formularios
        const formAsesoria = document.getElementById('formAsesoria');
        if (formAsesoria) {
            formAsesoria.addEventListener('submit', (e) => {
                e.preventDefault();
                this.enviarAsesoria();
            });
        }

        const formConsultoria = document.getElementById('formConsultoria');
        if (formConsultoria) {
            formConsultoria.addEventListener('submit', (e) => {
                e.preventDefault();
                this.enviarConsultoria();
            });
        }
    }

    abrirModalAsesoria() {
        const modal = document.getElementById('modal-asesoria');
        if (modal) modal.style.display = 'flex';
    }

    cerrarModalAsesoria() {
        const modal = document.getElementById('modal-asesoria');
        if (modal) modal.style.display = 'none';
    }

    abrirModalConsultoria() {
        const modal = document.getElementById('modal-consultoria');
        if (modal) modal.style.display = 'flex';
    }

    cerrarModalConsultoria() {
        const modal = document.getElementById('modal-consultoria');
        if (modal) modal.style.display = 'none';
    }

    abrirModalSolicitudes() {
        this.cargarEstadoSolicitudes();
        const modal = document.getElementById('modal-solicitudes');
        if (modal) modal.style.display = 'flex';
    }

    cerrarModalSolicitudes() {
        const modal = document.getElementById('modal-solicitudes');
        if (modal) modal.style.display = 'none';
    }

    enviarAsesoria() {
        const fecha = document.getElementById('fechaAsesoria').value;
        const hora = document.getElementById('horaAsesoria').value;
        const tema = document.getElementById('temaAsesoria').value;
        const descripcion = document.getElementById('descripcionAsesoria').value;

        this.servicioModel.agregar({
            tipo: 'Asesoría',
            fecha,
            hora,
            tema,
            descripcion
        });

        const solicitudes = this.servicioModel.obtenerTodas();
        this.view.actualizarTablaSolicitudes(solicitudes);

        document.getElementById('formAsesoria').reset();
        this.cerrarModalAsesoria();
        alert('Asesoría solicitada exitosamente');
    }

    enviarConsultoria() {
        const fecha = document.getElementById('fechaConsultoria').value;
        const hora = document.getElementById('horaConsultoria').value;
        const documentos = document.getElementById('documentosConsultoria').value;

        this.servicioModel.agregar({
            tipo: 'Consultoría',
            fecha,
            hora,
            documentos
        });

        const solicitudes = this.servicioModel.obtenerTodas();
        this.view.actualizarTablaSolicitudes(solicitudes);

        document.getElementById('formConsultoria').reset();
        this.cerrarModalConsultoria();
        alert('Consultoría solicitada exitosamente');
    }

    cargarEstadoSolicitudes() {
        const solicitudes = this.servicioModel.obtenerTodas();
        const estadoDiv = document.getElementById('estadoSolicitudes');
        
        if (solicitudes.length === 0) {
            estadoDiv.innerHTML = '<p>No hay solicitudes registradas aún.</p>';
            return;
        }

        let html = '<ul>';
        solicitudes.forEach(s => {
            html += `<li>Solicitud #${s.id} - ${s.tipo} - ${s.estado} - Creada: ${s.registradoEl}</li>`;
        });
        html += '</ul>';
        estadoDiv.innerHTML = html;
    }
}