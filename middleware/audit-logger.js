const { auditLogger } = require('utils/logger');

function auditMiddleware(req, res, next) {
  const startTime = Date.now();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'Unknown';
  const userId = req.user?.id || 'anonymous';
  const username = req.user?.username || 'anonymous';

  const originalSend = res.send;
  
  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    logRequest(req, res, {
      ip,
      userAgent,
      userId,
      username,
      duration,
      statusCode: res.statusCode
    });

    originalSend.call(this, data);
  };

  next();
}

function logRequest(req, res, metadata) {
  const { method, path, body } = req;
  const { ip, userAgent, userId, username, duration, statusCode } = metadata;

  if (path.includes('/login') && method === 'POST') {
    if (statusCode === 200) {
      auditLogger.loginSuccess(userId, body.email || body.username, ip, userAgent);
    } else {
      auditLogger.loginFailure(body.email || body.username, ip, userAgent, `Status: ${statusCode}`);
    }
    return;
  }

  if (path.includes('/logout')) {
    auditLogger.logout(userId, username, ip);
    return;
  }

  if (method === 'POST' && statusCode === 201) {
    const resourceType = extractResourceType(path);
    auditLogger.create(userId, resourceType, body.id || 'new', body);
    return;
  }

  if ((method === 'PUT' || method === 'PATCH') && statusCode === 200) {
    const resourceType = extractResourceType(path);
    const resourceId = extractResourceId(path);
    auditLogger.update(userId, resourceType, resourceId, body);
    return;
  }

  if (method === 'DELETE' && statusCode === 200) {
    const resourceType = extractResourceType(path);
    const resourceId = extractResourceId(path);
    auditLogger.delete(userId, resourceType, resourceId);
    return;
  }

  if (statusCode === 403) {
    auditLogger.accessDenied(userId, path, method, ip);
    return;
  }
  if (statusCode === 400 && res.locals?.sqlInjectionDetected) {
    auditLogger.sqlInjectionAttempt(ip, path, JSON.stringify(body));
    return;
  }

  if (statusCode >= 500) {
    auditLogger.systemError(
      new Error(`Server error on ${method} ${path}`),
      { userId, ip, statusCode, duration }
    );
    return;
  }

  if (shouldLogRequest(path, method)) {
    console.log(`[AUDIT] ${method} ${path} - User: ${userId} - Status: ${statusCode} - Duration: ${duration}ms`);
  }
}

function extractResourceType(path) {
  const match = path.match(/\/api\/([^\/]+)/);
  return match ? match[1] : 'unknown';
}

function extractResourceId(path) {
  const parts = path.split('/');
  const lastPart = parts[parts.length - 1];
  return isNaN(lastPart) ? 'unknown' : lastPart;
}

function shouldLogRequest(path, method) {
  if (path.includes('/salud') || path.includes('/health')) {
    return false;
  }
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true;
  }

  const sensitivePaths = ['/api/permissions', '/api/security', '/api/auth'];
  return sensitivePaths.some(sensitive => path.includes(sensitive));
}

function markSqlInjection(req, res, next) {
  res.locals.sqlInjectionDetected = true;
  next();
}

function auditCritical(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.user?.id || 'anonymous';
  
  console.log(`[CRITICAL] User ${userId} accessing ${req.path} from ${ip}`);
  
  next();
}

module.exports = {
  auditMiddleware,
  markSqlInjection,
  auditCritical
};