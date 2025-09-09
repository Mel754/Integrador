const express = require("express");
const router = express.Router();
const db = require("../config/db");
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.idsysuser, u.username, r.description AS rol, s.description AS estado
      FROM sysuser u
      JOIN userRole r ON u.userRole_iduserRole = r.iduserRole
      JOIN userStatus s ON u.userStatus_iduserStatus = s.iduserStatus
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { username, password, rolId, statusId, companyId } = req.body;

    const [result] = await db.query(`
      INSERT INTO sysuser (username, password, userRole_iduserRole, userStatus_iduserStatus, company_idcompany, creationDate)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [username, password, rolId, statusId, companyId]);

    res.json({ message: "Usuario creado ", userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
