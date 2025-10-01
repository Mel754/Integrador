class PerfilController {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
        this.view = new PerfilView();
    }

    inicializar() {
        this.renderizar();
        this.configurarEventos();
        this.crearModalPassword();
    }

    renderizar() {
        const usuario = this.usuarioModel.usuarioActual;
        this.view.render(usuario);
    }

    configurarEventos() {
        // Selector de rol
        const roleSelect = document.getElementById('roleSelect');
        if (roleSelect) {
            roleSelect.addEventListener('change', (e) => {
                this.cambiarRol(e.target.value);
            });
        }

        // Botón cambiar contraseña
        const btnPassword = document.getElementById('btnCambiarPassword');
        if (btnPassword) {
            btnPassword.addEventListener('click', () => this.abrirModalPassword());
        }
    }

    cambiarRol(nuevoRol) {
        this.usuarioModel.cambiarRol(nuevoRol);
        this.view.actualizarPanelAdmin(nuevoRol === 'admin');
        alert(`Rol cambiado a: ${nuevoRol === 'admin' ? 'Administrador' : 'Usuario'}`);
    }

    crearModalPassword() {
        const modalContainer = document.getElementById('modales-container');
        const modalHTML = `
            <div id="modal-pass" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="window.app.perfilController.cerrarModalPassword()">&times;</span>
                    <h2>Cambiar Contraseña</h2>
                    <div class="perfil-form">
                        <div class="form-field">
                            <label>Contraseña actual</label>
                            <input type="password" id="current-pass">
                        </div>
                        <div class="form-field">
                            <label>Nueva contraseña</label>
                            <input type="password" id="new-pass">
                        </div>
                        <div class="form-field">
                            <label>Confirmar nueva contraseña</label>
                            <input type="password" id="confirm-pass">
                        </div>
                        <button class="security-btn" onclick="window.app.perfilController.cambiarContraseña()">Guardar cambios</button>
                    </div>
                </div>
            </div>
        `;
        modalContainer.innerHTML += modalHTML;
    }

    abrirModalPassword() {
        const modal = document.getElementById('modal-pass');
        if (modal) modal.style.display = 'flex';
    }

    cerrarModalPassword() {
        const modal = document.getElementById('modal-pass');
        if (modal) modal.style.display = 'none';
    }

    cambiarContraseña() {
        const current = document.getElementById('current-pass').value;
        const nuevo = document.getElementById('new-pass').value;
        const confirm = document.getElementById('confirm-pass').value;

        if (!current || !nuevo || !confirm) {
            alert('Por favor completa todos los campos.');
            return;
        }

        if (nuevo.length < 8) {
            alert('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (!/[A-Z]/.test(nuevo)) {
            alert('La nueva contraseña debe contener al menos una letra mayúscula.');
            return;
        }

        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(nuevo)) {
            alert('La nueva contraseña debe contener al menos un carácter especial.');
            return;
        }

        if (nuevo !== confirm) {
            alert('La nueva contraseña y la confirmación no coinciden.');
            return;
        }

        if (nuevo === current) {
            alert('No puedes reutilizar tu contraseña actual.');
            return;
        }

        alert('Contraseña cambiada exitosamente! Se cerrará la sesión para aplicar los cambios.');
        
        this.cerrarModalPassword();
        document.getElementById('current-pass').value = '';
        document.getElementById('new-pass').value = '';
        document.getElementById('confirm-pass').value = '';
    }
}