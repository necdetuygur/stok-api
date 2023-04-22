const db = require("../db");
const { authorize } = require("../auth");
const express = require("express");
const router = express.Router();

db.run(`CREATE TABLE IF NOT EXISTS Stok (
  StokID INTEGER PRIMARY KEY AUTOINCREMENT,
  KullaniciID INTEGER NOT NULL,
  Ad TEXT NOT NULL,
  Miktar INTEGER NOT NULL,
  Birim TEXT NOT NULL
)`);

router.get("/", (req, res) => {
  const query = `SELECT * FROM Stok`;
  db.all(query, (err, Stoks) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    res.json(Stoks);
  });
});

router.post("/", authorize(["Yonetici"]), (req, res) => {
  const { Ad, Miktar, Birim } = req.body;
  const query = `INSERT INTO Stok (KullaniciID, Ad, Miktar, Birim) VALUES (?, ?, ?, ?)`;
  db.run(query, [req.Kullanici.KullaniciID, Ad, Miktar, Birim], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    const StokID = this.lastID;
    res.status(201).json({
      StokID,
      KullaniciID: req.Kullanici.KullaniciID,
      Ad,
      Miktar,
      Birim,
    });
  });
});

module.exports = router;
