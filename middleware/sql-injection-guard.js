function sqlInjectionGuard(req, res, next) {
  const dangerousPatterns = [
    /(\bSELECT\b|\bUNION\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
    /(--|#|\/\*|\*\/|;)/g,
    /(\bOR\b\s*[\d']+\s*=\s*[\d']|\bAND\b\s*[\d']+\s*=\s*[\d'])/gi,
    /(\bSLEEP\b|\bWAITFOR\b|\bBENCHMARK\b)/gi,
    /('{2,}|"{2,})/g,
    /(\\'|\\"|\\x|%27|%22)/gi
  ];


  const checkInput = (input) => {
    if (typeof input !== 'string') return false;
    
    return dangerousPatterns.some(pattern => pattern.test(input));
  };

  const validateObject = (obj, path = '') => {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        // Validar recursivamente
        const result = validateObject(value, currentPath);
        if (result) return result;
      } else if (checkInput(value)) {
        return { campo: currentPath, valor: value };
      }
    }
    return null;
  };

  try {
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyResult = validateObject(req.body);
      if (bodyResult) {
        console.warn('🚨 SQL Injection detectado en body:', bodyResult);
        return res.status(400).json({
          success: false,
          mensaje: 'Entrada no válida detectada',
          campo: bodyResult.campo,
          codigo: 'SQL_INJECTION_DETECTED'
        });
      }
    }

    if (req.query && Object.keys(req.query).length > 0) {
      const queryResult = validateObject(req.query);
      if (queryResult) {
        console.warn('🚨 SQL Injection detectado en query:', queryResult);
        return res.status(400).json({
          success: false,
          mensaje: 'Parámetros de consulta no válidos',
          campo: queryResult.campo,
          codigo: 'SQL_INJECTION_DETECTED'
        });
      }
    }

    if (req.params && Object.keys(req.params).length > 0) {
      const paramsResult = validateObject(req.params);
      if (paramsResult) {
        console.warn('🚨 SQL Injection detectado en params:', paramsResult);
        return res.status(400).json({
          success: false,
          mensaje: 'Parámetros de URL no válidos',
          campo: paramsResult.campo,
          codigo: 'SQL_INJECTION_DETECTED'
        });
      }
    }
    next();

} catch (error) {
    console.error('❌ Error en SQL Injection Guard:', error);
    return res.status(500).json({
      success: false,
      mensaje: 'Error en validación de seguridad',
      error: error.message
    });
  }
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/['"`;]/g, '') 
    .replace(/--/g, '')   
    .replace(/\/\*/g, '')   
    .replace(/\*\//g, '')  
    .trim();
}

module.exports = sqlInjectionGuard;
module.exports.sanitizeInput = sanitizeInput;