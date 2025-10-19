const router = require('express').Router();
const { verificarToken } = require('../auth');
const D = require('../controllers/dashboardController');

router.get('/metrics', verificarToken, D.metrics);
module.exports = router;
