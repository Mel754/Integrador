class RegistroController {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
        this.view = new RegistroView();
    }

    inicializar() {
        this.renderizar();
        this.configurarEventos();
    }

    renderizar() {
        const data = {
            usuarios: this.usuarioModel.obtenerTodos(),
            esAdmin: this.usuarioModel.esAdmin()
        };
        this.view.render(data);
    }

    configurarEventos() {
        const formRegistro = document.getElementById('formRegistroUsuario');
        if (formRegistro) {
            formRegistro.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registrarUsuario();
            });
        }

        const buscador = document.getElementById('buscadorUsuarios');
        if (buscador) {
            buscador.addEventListener('input', (e) => {
                this.buscarUsuarios(e.target.value);
            });
        }

        const filtroRol = document.getElementById('filtroRol');
        const filtroEstado = document.getElementById('filtroEstado');

        if (filtroRol) {
            filtroRol.addEventListener('change', () => this.aplicarFiltros());
        }

        if (filtroEstado) {
            filtroEstado.addEventListener('change', () => this.aplicarFiltros());
        }

        // Botones de activar/desactivar
        document.querySelectorAll('.btn-toggle-estado').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const usuarioId = parseInt(e.target.dataset.usuarioId);
                this.toggleEstadoUsuario(usuarioId);
            });
        });
        // Botones de eliminar usuario
        document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const usuarioId = parseInt(e.target.dataset.usuarioId);
                this.eliminarUsuario(usuarioId);
            });
        });

    }

    registrarUsuario() {
        const nombre = document.getElementById('registroNombre').value.trim();
        const email = document.getElementById('registroEmail').value.trim();
        const rol = document.getElementById('registroRol').value;
        const estado = document.getElementById('registroEstado').value;
        const password = document.getElementById('registroPassword').value;
        const passwordConfirm = document.getElementById('registroPasswordConfirm').value;

        if (!nombre || !email || !password || !passwordConfirm) {
            this.view.mostrarMensaje('Por favor complete todos los campos obligatorios', 'error');
            return;
        }

        if (this.usuarioModel.emailExiste(email)) {
            this.view.mostrarMensaje('Este correo ya está registrado', 'error');
            return;
        }

        if (!this.usuarioModel.validarEmail(email)) {
            this.view.mostrarMensaje('El formato del correo no es válido', 'error');
            return;
        }

        const validacionPassword = this.usuarioModel.validarPassword(password);
        if (!validacionPassword.valido) {
            this.view.mostrarMensaje(validacionPassword.mensaje, 'error');
            return;
        }

        if (password !== passwordConfirm) {
            this.view.mostrarMensaje('Las contraseñas no coinciden', 'error');
            return;
        }

        // Registrar usuario
        const nuevoUsuario = this.usuarioModel.registrarUsuario({
            nombre,
            email,
            rol,
            estado
        });

        this.view.mostrarMensaje(`Usuario ${nuevoUsuario.nombre} registrado exitosamente`, 'success');
        
        // Limpiar formulario
        document.getElementById('formRegistroUsuario').reset();
        
        // Actualizar tabla
        this.inicializar();
    }

    buscarUsuarios(termino) {
        if (!termino.trim()) {
            this.view.actualizarTabla(
                this.usuarioModel.obtenerTodos(),
                this.usuarioModel.esAdmin()
            );
            this.configurarEventos();
            return;
        }

        const usuariosEncontrados = this.usuarioModel.buscarUsuarios(termino);
        this.view.actualizarTabla(usuariosEncontrados, this.usuarioModel.esAdmin());
        this.configurarEventos();
    }

    aplicarFiltros() {
        const filtroRol = document.getElementById('filtroRol').value;
        const filtroEstado = document.getElementById('filtroEstado').value;

        let usuarios = this.usuarioModel.obtenerTodos();

        if (filtroRol !== 'todos') {
            usuarios = usuarios.filter(u => u.rol === filtroRol);
        }

        if (filtroEstado !== 'todos') {
            usuarios = usuarios.filter(u => u.estado === filtroEstado);
        }

        this.view.actualizarTabla(usuarios, this.usuarioModel.esAdmin());
        this.configurarEventos();
    }
    toggleEstadoUsuario(usuarioId) {
        if (!this.usuarioModel.esAdmin()) {
            this.view.mostrarMensaje('Solo los administradores pueden cambiar el estado de usuarios', 'error');
            return;
        }

        const usuario = this.usuarioModel.activarDesactivarUsuario(usuarioId);
        if (usuario) {
            this.view.mostrarMensaje(
                `Usuario ${usuario.estado === 'Activo' ? 'activado' : 'desactivado'} exitosamente`,
                'success'
            );
            this.aplicarFiltros();
        }
    }
    eliminarUsuario(usuarioId) {
        if (!this.usuarioModel.esAdmin()) {
            this.view.mostrarMensaje('Solo los administradores pueden eliminar usuarios', 'error');
            return;
        }
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            return;
        }
        
        const admin = this.usuarioModel.usuarioActual;
        const fechaEliminacion = new Date().toISOString();
        
        const eliminado = this.usuarioModel.eliminarUsuario(usuarioId, {
            fecha: fechaEliminacion,
            responsable: admin?.nombre || 'Administrador'
        });
        
        if (eliminado) {
            this.view.mostrarMensaje('Usuario eliminado exitosamente', 'success');
            this.aplicarFiltros(); // refrescar tabla
        } else {
            this.view.mostrarMensaje('No se pudo eliminar el usuario', 'error');
        }
    }
}