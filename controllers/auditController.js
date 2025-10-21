const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function getLogs(req, res) {
  try {
    const {
      usuario,        
      fechaInicio,    
      fechaFin,       
      tipoEvento,     
      accion,         
      limite = 100,   
      pagina = 1      
    } = req.query;

    const logFilePath = path.join(__dirname, './logs/audit.log');

    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({
        success: false,
        mensaje: 'No se encontraron logs de auditoría'
      });
    }

    const logs = await readAndFilterLogs(logFilePath, {
      usuario,
      fechaInicio,
      fechaFin,
      tipoEvento,
      accion,
      limite: parseInt(limite),
      pagina: parseInt(pagina)
    });

    res.json({
      success: true,
      total: logs.total,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      datos: logs.results
    });

  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al consultar logs de auditoría',
      error: error.message
    });
  }
}

async function readAndFilterLogs(filePath, filters) {
  return new Promise((resolve, reject) => {
    const results = [];
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      try {
        const logEntry = JSON.parse(line);
        
        if (matchesFilters(logEntry, filters)) {
          results.push(logEntry);
        }
      } catch (e) {
      }
    });

    rl.on('close', () => {
      results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      const start = (filters.pagina - 1) * filters.limite;
      const end = start + filters.limite;
      const paginatedResults = results.slice(start, end);

      resolve({
        total: results.length,
        results: paginatedResults
      });
    });

    rl.on('error', reject);
  });
}

function matchesFilters(logEntry, filters) {

  if (filters.usuario) {
    const matchUser = 
      logEntry.userId === filters.usuario ||
      logEntry.username?.toLowerCase().includes(filters.usuario.toLowerCase());
    
    if (!matchUser) return false;
  }

  if (filters.fechaInicio) {
    const logDate = new Date(logEntry.timestamp);
    const startDate = new Date(filters.fechaInicio);
    if (logDate < startDate) return false;
  }

  if (filters.fechaFin) {
    const logDate = new Date(logEntry.timestamp);
    const endDate = new Date(filters.fechaFin + 'T23:59:59');
    if (logDate > endDate) return false;
  }

  if (filters.tipoEvento) {
    if (logEntry.eventType !== filters.tipoEvento) return false;
  }

  if (filters.accion) {
    if (logEntry.action !== filters.accion) return false;
  }

  return true;
}

async function getAuditStats(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const logFilePath = path.join(__dirname, '../logs/audit.log');

    if (!fs.existsSync(logFilePath)) {
      return res.json({
        success: true,
        stats: {
          totalEventos: 0,
          loginExitosos: 0,
          loginFallidos: 0,
          modificaciones: 0,
          eliminaciones: 0,
          accesoDenegado: 0,
          sqlInjectionAttempts: 0
        }
      });
    }

    const stats = await calculateStats(logFilePath, { fechaInicio, fechaFin });

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error al calcular estadísticas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al calcular estadísticas',
      error: error.message
    });
  }
}

async function calculateStats(filePath, filters) {
  return new Promise((resolve, reject) => {
    const stats = {
      totalEventos: 0,
      loginExitosos: 0,
      loginFallidos: 0,
      modificaciones: 0,
      eliminaciones: 0,
      accesoDenegado: 0,
      sqlInjectionAttempts: 0,
      eventosPorTipo: {},
      eventosPorDia: {}
    };

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      try {
        const logEntry = JSON.parse(line);

        if (filters.fechaInicio || filters.fechaFin) {
          const logDate = new Date(logEntry.timestamp);
          if (filters.fechaInicio && logDate < new Date(filters.fechaInicio)) return;
          if (filters.fechaFin && logDate > new Date(filters.fechaFin + 'T23:59:59')) return;
        }

        stats.totalEventos++;

        if (logEntry.action === 'LOGIN' && logEntry.status === 'SUCCESS') {
          stats.loginExitosos++;
        } else if (logEntry.action === 'LOGIN' && logEntry.status === 'FAILURE') {
          stats.loginFallidos++;
        } else if (['CREATE', 'UPDATE'].includes(logEntry.action)) {
          stats.modificaciones++;
        } else if (logEntry.action === 'DELETE') {
          stats.eliminaciones++;
        } else if (logEntry.action === 'ACCESS_DENIED') {
          stats.accesoDenegado++;
        } else if (logEntry.action === 'SQL_INJECTION') {
          stats.sqlInjectionAttempts++;
        }

        const eventType = logEntry.eventType || 'UNKNOWN';
        stats.eventosPorTipo[eventType] = (stats.eventosPorTipo[eventType] || 0) + 1;

        const day = logEntry.timestamp.split('T')[0];
        stats.eventosPorDia[day] = (stats.eventosPorDia[day] || 0) + 1;

      } catch (e) {
      }
    });

    rl.on('close', () => resolve(stats));
    rl.on('error', reject);
  });
}

async function exportLogs(req, res) {
  try {
    const { formato = 'json' } = req.query;
    const logFilePath = path.join(__dirname, '../logs/audit.log');

    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({
        success: false,
        mensaje: 'No hay logs para exportar'
      });
    }

    if (formato === 'json') {
      res.download(logFilePath, `audit_${Date.now()}.log`);
    } else {
      res.status(400).json({
        success: false,
        mensaje: 'Formato no soportado'
      });
    }

  } catch (error) {
    console.error('Error al exportar logs:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al exportar logs',
      error: error.message
    });
  }
}

module.exports = {
  getLogs,
  getAuditStats,
  exportLogs

};
