const router = require('express').Router();
const { verificarToken } = require('../auth'); // si ya lo tienes
const C = require('../controllers/calendarController');

router.post('/', verificarToken, C.createMeeting);
router.get('/', verificarToken, C.listMeetings);
router.get('/:id/ics', verificarToken, C.getICS);

module.exports = router;
