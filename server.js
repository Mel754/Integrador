// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const securityRoutes = require('./routes/security');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
// Rutas
app.use('/security', securityRoutes);

app.get('/', (req, res) => res.json({ message: 'mi-backend API funcionando' }));

app.listen(PORT, () => {
  console.log(`✅ mi-backend corriendo en http://localhost:${PORT}`);
});
const permissionsRoutes = require('./routes/permissions');
app.use('/permissions', permissionsRoutes);
