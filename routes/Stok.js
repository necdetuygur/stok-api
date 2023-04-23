const db = require("../db");
const { authorize } = require("../auth");
const express = require("express");
const router = express.Router();

db.run(`CREATE TABLE IF NOT EXISTS Stok (
  StokID INTEGER PRIMARY KEY AUTOINCREMENT,
  KullaniciID INTEGER NOT NULL,
  Kod TEXT UNIQUE NOT NULL,
  Grup TEXT NOT NULL,
  Ad TEXT NOT NULL,
  Miktar INTEGER NOT NULL,
  Fiyat INTEGER NOT NULL,
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

router.get("/:StokID", (req, res) => {
  const { StokID } = req.params;
  db.get(
    "SELECT * FROM Stok WHERE StokID = ?",
    [StokID],
    async function (err, row) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }
      res.json(row);
    }
  );
});

router.post("/", authorize(["Yonetici"]), (req, res) => {
  const { Kod, Grup, Ad, Miktar, Fiyat, Birim } = req.body;
  const query = `INSERT INTO Stok (KullaniciID, Kod, Grup, Ad, Miktar, Fiyat, Birim) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(
    query,
    [req.Kullanici.KullaniciID, Kod, Grup, Ad, Miktar, Fiyat, Birim],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }
      const StokID = this.lastID;
      res.status(201).json({
        StokID,
        KullaniciID: req.Kullanici.KullaniciID,
        Kod,
        Grup,
        Ad,
        Miktar,
        Fiyat,
        Birim,
      });
    }
  );
});

router.put("/:StokID", authorize(["Yonetici"]), (req, res) => {
  const { StokID } = req.params;
  const { Kod, Grup, Ad, Miktar, Fiyat, Birim } = req.body;

  const query = `UPDATE Stok SET KullaniciID = ?, Kod = ?, Grup = ?, Ad = ?, Miktar = ?, Fiyat = ?, Birim = ? WHERE StokID = ?`;

  db.run(
    query,
    [req.Kullanici.KullaniciID, Kod, Grup, Ad, Miktar, Fiyat, Birim, StokID],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }

      if (this.changes === 0) {
        return res.status(404).send("Değişiklik yapılmadı");
      }

      res.status(201).json({
        StokID,
        KullaniciID: req.Kullanici.KullaniciID,
        Kod,
        Grup,
        Ad,
        Miktar,
        Fiyat,
        Birim,
      });
    }
  );
});

module.exports = router;
