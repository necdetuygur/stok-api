const db = require("../db");
const { authorize } = require("../auth");
const express = require("express");
const router = express.Router();

const { faker } = require("@faker-js/faker/locale/tr");

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
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    res.json(rows);
  });
});

router.get("/seed", (req, res) => {
  let i = 10;
  while (i--) {
    const Kod = faker.database.mongodbObjectId();
    const Grup = faker.commerce.department();
    const Ad = faker.commerce.product();
    const Miktar = faker.commerce.price();
    const Fiyat = faker.commerce.price();
    const Birim = i % 2 ? "Metre" : "Kilo";

    const query = `INSERT INTO Stok (KullaniciID, Kod, Grup, Ad, Miktar, Fiyat, Birim) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [1, Kod, Grup, Ad, Miktar, Fiyat, Birim], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }
    });
  }
  return res.status(201).send("OK");
});

router.get("/ad", (req, res) => {
  const query = `SELECT Ad FROM Stok GROUP BY Ad ORDER BY Ad ASC`;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    res.json(rows.map((x) => x.Ad));
  });
});

router.get("/kod", (req, res) => {
  const query = `SELECT Kod FROM Stok GROUP BY Kod ORDER BY Kod ASC`;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    res.json(rows.map((x) => x.Kod));
  });
});

router.get("/birim", (req, res) => {
  const query = `SELECT Birim FROM Stok GROUP BY Birim ORDER BY Birim ASC`;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    res.json(rows.map((x) => x.Birim));
  });
});

router.get("/grup", (req, res) => {
  const query = `SELECT Grup FROM Stok GROUP BY Grup ORDER BY Grup ASC`;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    res.json(rows.map((x) => x.Grup));
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

  StokLog(StokID, req.Kullanici.KullaniciID) &&
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

const StokLog = (StokID, KullaniciID) => {
  db.get("SELECT * FROM Stok WHERE StokID = ?", [StokID], function (err, row) {
    if (err) {
      console.error(err.message);
      return false;
    }
    if (row) {
      db.run(
        `INSERT INTO StokLog (StokID, KullaniciID, Kod, Grup, Ad, Miktar, Fiyat, Birim) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          StokID,
          KullaniciID,
          row.Kod,
          row.Grup,
          row.Ad,
          row.Miktar,
          row.Fiyat,
          row.Birim,
        ],
        function (err) {
          if (err) {
            console.error(err.message);
            return false;
          }
        }
      );
    }
  });
  return true;
};

module.exports = router;
