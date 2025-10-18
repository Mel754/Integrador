const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');

router.get('/', proyectosController.obtenerProyectos);
router.get('/:id', proyectosController.obtenerProyectoPorId);
router.post('/', proyectosController.crearProyecto);
router.put('/:id', proyectosController.actualizarProyecto);
router.delete('/:id', proyectosController.eliminarProyecto);
router.get('/sector/:sector', proyectosController.obtenerProyectosPorSector);
router.get('/revision/pendientes', proyectosController.obtenerProyectosEnRevision);
router.post('/:id/revision', proyectosController.actualizarRevision);

module.exports = router;