const express = require('express');
const router = express.Router();

router.post('/postulaciones', (req, res) => {
  const datos = req.body;
  
  // Aquí guardas en la base de datos
  console.log('Datos recibidos:', datos);
  
  res.json({ 
    id: Date.now(),
    mensaje: 'Postulación guardada exitosamente' 
  });
});

module.exports = router;