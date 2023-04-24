const bcrypt = require("bcrypt");
const { jwt, SECRET_KEY, authorize } = require("../auth");
const db = require("../db");

const { faker } = require("@faker-js/faker/locale/tr");

const express = require("express");
const router = express.Router();

db.run(`CREATE TABLE IF NOT EXISTS StokLog (
  StokLogID INTEGER PRIMARY KEY AUTOINCREMENT,
  StokID INTEGER NOT NULL,
  KullaniciID INTEGER NOT NULL,
  Kod TEXT UNIQUE NOT NULL,
  Grup TEXT NOT NULL,
  Ad TEXT NOT NULL,
  Miktar INTEGER NOT NULL,
  Fiyat INTEGER NOT NULL,
  Birim TEXT NOT NULL,
  Zaman DATE DEFAULT (DateTime('now', 'localtime'))
)`);

router.get("/:StokID", (req, res) => {
  const { StokID } = req.params;
  db.all(
    "SELECT sl.*, k.Ad || ' ' || k.Soyad Kullanici FROM StokLog sl INNER JOIN Kullanici k ON k.KullaniciID = sl.KullaniciID WHERE sl.StokID = ? ORDER BY sl.Zaman DESC",
    [StokID],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }
      res.json(rows);
    }
  );
});

module.exports = router;
