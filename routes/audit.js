const express = require('express');
const router = express.Router();
const auditController = require('./controllers/auditController');

router.get('/logs', auditController.getLogs);

router.get('/stats', auditController.getAuditStats);

router.get('/export', auditController.exportLogs);


module.exports = router;
