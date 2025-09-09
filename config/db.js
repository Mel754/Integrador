const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "207.248.81.130", 
  user: "TU_USUARIO",     
  password: "TU_PASSWORD", 
  database: "TU_BASEDATOS", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
