const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET_KEY = "clave"; 


router.post("/login", (req, res) => {
  const { username, password } = req.body;


  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "15m" }); 
    res.json({ message: "Login exitoso ✅", token });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});

// Middleware para validar token
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: "Token inválido o expirado" });
    req.user = user;
    next();
  });
}

router.get("/protegida", verificarToken, (req, res) => {
  res.json({ message: "Acceso concedido 🚀", user: req.user });
});

module.exports = router;
