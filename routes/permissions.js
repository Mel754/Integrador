
const express = require('express');
const { getUserPermissions, setUserPermission } = require('../controllers/permissionscontroller');

const router = express.Router();

router.get('/:userId', getUserPermissions);
router.post('/:userId', setUserPermission);

module.exports = router;
