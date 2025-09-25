const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

// tus middlewares y rutas aquí…

const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
};

https.createServer(options, app)
  .listen(443, () => {
    console.log('Servidor HTTPS escuchando en puerto 443');
  });

http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
  res.end();
}).listen(80, () => {
  console.log('Redirigiendo HTTP → HTTPS en puerto 80');
});
