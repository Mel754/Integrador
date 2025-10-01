class UsuarioModel {
    constructor() {
        const guardados = localStorage.getItem('usuarios');
        this.usuarios = guardados ? JSON.parse(guardados) : [];
        this.contadorId = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.id)) + 1 : 1;
    }

    cargarUsuarios() {
        const usuariosGuardados = localStorage.getItem('usuarios');
        return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
    }

    cargarUsuarioActual() {
        const usuarioGuardado = localStorage.getItem('usuarioActual');
        return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    }

    guardarUsuarioActual() {
        localStorage.setItem('usuarioActual', JSON.stringify(this.usuarioActual));
    }

    obtenerTodos() {
        return this.usuarios;
    }

    contarTotal() {
        return this.usuarios.length;
    }

    cambiarRol(nuevoRol) {
        this.usuarioActual.rol = nuevoRol;
        this.guardarUsuarioActual();
    }

    esAdmin() {
        return this.usuarioActual && this.usuarioActual.rol === 'admin';
    }

    actualizarPerfil(datos) {
        this.usuarioActual = { ...this.usuarioActual, ...datos };
        this.guardarUsuarioActual();
    }
    obtenerPorId(id) {
        return this.usuarios.find(u => u.id === id);
    }
    agregarUsuario(usuario) {
        const nuevoId = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.id)) + 1 : 1;
        const nuevoUsuario = { id: nuevoId, ...usuario };
        this.usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        return nuevoUsuario;
    }
    validarEmail(email) {    
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    
        return regex.test(email);
    }
    validarPassword(password) {    
        if (password.length < 8) return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' };
        if (!/[A-Z]/.test(password)) return { valido: false, mensaje: 'Debe contener al menos una mayúscula' };
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return { valido: false, mensaje: 'Debe contener al menos un carácter especial' };
        return { valido: true };
    }
    emailExiste(email) {    
        return this.usuarios.some(u => u.email === email);
    }

    registrarUsuario(datos) {    
        const nuevoId = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.id)) + 1 : 1;    
        const nuevoUsuario = {       
            id: nuevoId,       
            nombre: datos.nombre,       
            email: datos.email,       
            rol: datos.rol || 'Usuario',       
            estado: datos.estado || 'Activo',       
            fechaRegistro: new Date().toISOString()    
        };  
        this.usuarios.push(nuevoUsuario);  
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));  
        return nuevoUsuario;
    }
    buscarUsuarios(termino) {
        const terminoLower = termino.toLowerCase();
        return this.usuarios.filter(u => 
            u.nombre.toLowerCase().includes(terminoLower) ||
            u.email.toLowerCase().includes(terminoLower) ||
            u.rol.toLowerCase().includes(terminoLower) ||
            u.estado.toLowerCase().includes(terminoLower)
        );
    }

filtrarPorRol(rol) {
    if (rol === 'todos') return this.usuarios;
    return this.usuarios.filter(u => u.rol === rol);
}

filtrarPorEstado(estado) {
    if (estado === 'todos') return this.usuarios;
    return this.usuarios.filter(u => u.estado === estado);
}

actualizarEstado(id, nuevoEstado) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.estado = nuevoEstado;
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        return true;
    }
    return false;
}

activarDesactivarUsuario(id) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        return usuario;
    }
    return null;
}
eliminarUsuario(id, responsable) {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
        const usuarioEliminado = this.usuarios[index];
        usuarioEliminado.eliminado = true;
        usuarioEliminado.fechaEliminacion = new Date();
        usuarioEliminado.responsableEliminacion = responsable || 'Sistema';
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        return true;
    }
    return false;
}

}