const router = require('express').Router();
const { verificarToken } = require('../auth');
const A = require('../controllers/actasController');

router.post('/:meeting_id/html', verificarToken, A.renderActaHtml);
router.post('/:meeting_id/pdf', verificarToken, A.renderActaPdf);
router.post('/:meeting_id/distribuir', verificarToken, A.distribuirActa);

module.exports = router;
