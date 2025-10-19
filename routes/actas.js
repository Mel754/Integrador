const router = require('express').Router();
const { verificarToken } = require('../auth');
const A = require('../controllers/actasController');

router.post('/:meeting_id/html', verificarToken, A.renderActaHtml);

module.exports = router;
