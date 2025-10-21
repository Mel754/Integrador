const winston = require('winston');
const path = require('path');

const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS' // ← US-132.02: Precisión de milisegundos
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { 
    service: 'jc-automatic-robotic',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/errors.log'),
      level: 'error',
      maxsize: 5242880, 
      maxFiles: 5,
    }),
    
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
    
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/audit.log'),
      level: 'info',
      maxsize: 10485760, 
      maxFiles: 30, 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

const auditLogger = {
  
  loginSuccess(userId, username, ip, userAgent) {
    logger.info('LOGIN_SUCCESS', {
      eventType: 'AUTHENTICATION',
      action: 'LOGIN',
      status: 'SUCCESS',
      userId,
      username,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });
  },

  loginFailure(username, ip, userAgent, reason) {
    logger.warn('LOGIN_FAILURE', {
      eventType: 'AUTHENTICATION',
      action: 'LOGIN',
      status: 'FAILURE',
      username,
      ip,
      userAgent,
      reason,
      timestamp: new Date().toISOString()
    });
  },

  logout(userId, username, ip) {
    logger.info('LOGOUT', {
      eventType: 'AUTHENTICATION',
      action: 'LOGOUT',
      userId,
      username,
      ip,
      timestamp: new Date().toISOString()
    });
  },

  create(userId, resourceType, resourceId, data) {
    logger.info('RESOURCE_CREATED', {
      eventType: 'DATA_MODIFICATION',
      action: 'CREATE',
      userId,
      resourceType,
      resourceId,
      data: sanitizeData(data),
      timestamp: new Date().toISOString()
    });
  },

  update(userId, resourceType, resourceId, changes) {
    logger.info('RESOURCE_UPDATED', {
      eventType: 'DATA_MODIFICATION',
      action: 'UPDATE',
      userId,
      resourceType,
      resourceId,
      changes: sanitizeData(changes),
      timestamp: new Date().toISOString()
    });
  },

  delete(userId, resourceType, resourceId) {
    logger.warn('RESOURCE_DELETED', {
      eventType: 'DATA_MODIFICATION',
      action: 'DELETE',
      userId,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString()
    });
  },

  accessDenied(userId, resource, action, ip) {
    logger.warn('ACCESS_DENIED', {
      eventType: 'SECURITY',
      action: 'ACCESS_DENIED',
      userId,
      resource,
      attemptedAction: action,
      ip,
      timestamp: new Date().toISOString()
    });
  },


  sqlInjectionAttempt(ip, endpoint, payload) {
    logger.error('SQL_INJECTION_ATTEMPT', {
      eventType: 'SECURITY',
      action: 'SQL_INJECTION',
      status: 'BLOCKED',
      ip,
      endpoint,
      payload: payload.substring(0, 100), // Solo primeros 100 chars
      timestamp: new Date().toISOString()
    });
  },

  systemError(error, context) {
    logger.error('SYSTEM_ERROR', {
      eventType: 'ERROR',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  },

  permissionChange(adminId, targetUserId, oldPerms, newPerms) {
    logger.warn('PERMISSION_CHANGED', {
      eventType: 'SECURITY',
      action: 'PERMISSION_CHANGE',
      adminId,
      targetUserId,
      oldPermissions: oldPerms,
      newPermissions: newPerms,
      timestamp: new Date().toISOString()
    });
  },

  suspiciousActivity(userId, activity, details) {
    logger.warn('SUSPICIOUS_ACTIVITY', {
      eventType: 'SECURITY',
      action: 'SUSPICIOUS',
      userId,
      activity,
      details,
      timestamp: new Date().toISOString()
    });
  }
};

function sanitizeData(data) {
  if (!data) return data;
  
  const sanitized = { ...data };
  const sensitiveFields = ['password', 'token', 'credit_card', 'ssn', 'api_key'];
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  }
  
  return sanitized;
}

module.exports = {
  logger,
  auditLogger
};