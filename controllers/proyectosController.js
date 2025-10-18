const pool = require('../config/db');

// Obtener todos los proyectos
async function obtenerProyectos(req, res) {
  try {
    const connection = await pool.getConnection();
    const [proyectos] = await connection.query(
      'SELECT * FROM proyectos ORDER BY fechaEnvio DESC'
    );
    connection.release();
    
    res.json({
      success: true,
      mensaje: 'Proyectos obtenidos correctamente',
      total: proyectos.length,
      data: proyectos
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener proyectos',
      error: error.message
    });
  }
}

// Obtener proyecto por ID
async function obtenerProyectoPorId(req, res) {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [proyectos] = await connection.query(
      'SELECT * FROM proyectos WHERE id = ?',
      [id]
    );
    connection.release();
    
    if (proyectos.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Proyecto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: proyectos[0]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Crear nuevo proyecto
async function crearProyecto(req, res) {
  try {
    const {
      nombreProyecto,
      descripcionProyecto,
      sector,
      estado,
      presupuesto,
      plazo,
      tecnologias,
      objetivos,
      nombreSolicitante,
      emailSolicitante,
      telefonoSolicitante,
      empresa,
      cargo,
      departamento
    } = req.body;

    // Validar campos obligatorios
    if (!nombreProyecto || !emailSolicitante || !nombreSolicitante) {
      return res.status(400).json({
        success: false,
        mensaje: 'Faltan campos obligatorios'
      });
    }

    const connection = await pool.getConnection();
    
    const query = `
      INSERT INTO proyectos (
        nombreProyecto,
        descripcionProyecto,
        sector,
        estado,
        presupuesto,
        plazo,
        tecnologias,
        objetivos,
        nombreSolicitante,
        emailSolicitante,
        telefonoSolicitante,
        empresa,
        cargo,
        departamento,
        estado_revision,
        fechaEnvio,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await connection.query(query, [
      nombreProyecto,
      descripcionProyecto,
      sector,
      estado || 'Idea',
      presupuesto,
      plazo,
      tecnologias,
      objetivos,
      nombreSolicitante,
      emailSolicitante,
      telefonoSolicitante,
      empresa,
      cargo,
      departamento,
      'En revisión'
    ]);

    connection.release();

    res.status(201).json({
      success: true,
      mensaje: 'Proyecto creado exitosamente y enviado a revisión',
      data: {
        id: result.insertId,
        nombreProyecto,
        estado_revision: 'En revisión'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      success: false,
      mensaje: 'Error al crear el proyecto',
      error: error.message
    });
  }
}

// Actualizar proyecto
async function actualizarProyecto(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const connection = await pool.getConnection();
    
    // Construir query dinámico
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const [result] = await connection.query(
      `UPDATE proyectos SET ${fields}, updatedAt = NOW() WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        mensaje: 'Proyecto no encontrado'
      });
    }

    connection.release();

    res.json({
      success: true,
      mensaje: 'Proyecto actualizado correctamente'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Eliminar proyecto
async function eliminarProyecto(req, res) {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      'DELETE FROM proyectos WHERE id = ?',
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Proyecto no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Proyecto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Obtener proyectos por sector
async function obtenerProyectosPorSector(req, res) {
  try {
    const { sector } = req.params;
    const connection = await pool.getConnection();
    
    const [proyectos] = await connection.query(
      'SELECT * FROM proyectos WHERE sector = ? ORDER BY createdAt DESC',
      [sector]
    );

    connection.release();

    res.json({
      success: true,
      total: proyectos.length,
      data: proyectos
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Obtener proyectos en revisión (para admin)
async function obtenerProyectosEnRevision(req, res) {
  try {
    const connection = await pool.getConnection();
    
    const [proyectos] = await connection.query(
      'SELECT * FROM proyectos WHERE estado_revision = "En revisión" ORDER BY fechaEnvio DESC'
    );

    connection.release();

    res.json({
      success: true,
      total: proyectos.length,
      data: proyectos
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Actualizar estado de revisión (admin)
async function actualizarRevision(req, res) {
  try {
    const { id } = req.params;
    const { estado_revision, comentarios_revision } = req.body;

    if (!['Aprobado', 'Rechazado'].includes(estado_revision)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Estado de revisión inválido'
      });
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `UPDATE proyectos SET estado_revision = ?, comentarios_revision = ?, fechaRevision = NOW(), updatedAt = NOW() WHERE id = ?`,
      [estado_revision, comentarios_revision || null, id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Proyecto no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: `Proyecto ${estado_revision.toLowerCase()} correctamente`
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  obtenerProyectos,
  obtenerProyectoPorId,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  obtenerProyectosPorSector,
  obtenerProyectosEnRevision,
  actualizarRevision
};