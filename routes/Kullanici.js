const bcrypt = require("bcrypt");
const { jwt, SECRET_KEY, authorize } = require("../auth");
const db = require("../db");

const express = require("express");
const router = express.Router();

db.run(`CREATE TABLE IF NOT EXISTS Kullanici (
  KullaniciID INTEGER PRIMARY KEY AUTOINCREMENT,
  Ad TEXT NOT NULL,
  Soyad TEXT NOT NULL,
  Telefon TEXT NULL,
  KullaniciAdi TEXT NOT NULL,
  Sifre TEXT NOT NULL,
  Rol TEXT NOT NULL
)`);

router.post("/kayit", (req, res) => {
  try {
    let { Ad, Soyad, Telefon, KullaniciAdi, Sifre } = req.body;

    db.get(
      "SELECT * FROM Kullanici WHERE KullaniciAdi = ?",
      [KullaniciAdi],
      async function (err, row) {
        if (row) {
          return res.status(400).json({ msg: "Kullanıcı mevcut" });
        }

        Ad = ucwords(Ad);
        Soyad = ucwords(Soyad);

        const salt = await bcrypt.genSalt(10);
        const hashedSifre = await bcrypt.hash(Sifre, salt);

        db.run(
          "INSERT INTO Kullanici (Ad, Soyad, Telefon, KullaniciAdi, Sifre, Rol) VALUES (?, ?, ?, ?, ?, ?)",
          [Ad, Soyad, Telefon, KullaniciAdi, hashedSifre, "Kullanici"],
          function (err) {
            if (err) {
              return res.status(500).send("Server error");
            }

            const Token = jwt.sign({ KullaniciAdi: KullaniciAdi }, SECRET_KEY, {
              expiresIn: "24h",
            });
            res.json({
              Token,
              Ad,
              Soyad,
              Telefon,
              KullaniciAdi,
              Rol: "Kullanici",
            });
          }
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/giris", (req, res) => {
  const { KullaniciAdi, Sifre } = req.body;

  const query = `SELECT * FROM Kullanici WHERE KullaniciAdi = ?`;

  db.get(query, [KullaniciAdi], async (err, Kullanici) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }

    if (!Kullanici) {
      return res.status(401).send("Geçersiz kullanıcı bilgileri");
    }

    const isMatch = await bcrypt.compare(Sifre, Kullanici.Sifre);
    if (!isMatch) {
      return res.status(400).json({ msg: "Geçersiz kullanıcı bilgileri" });
    }

    const Token = jwt.sign(
      { KullaniciAdi: Kullanici.KullaniciAdi },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.json({
      Token,
      Ad: Kullanici.Ad,
      Soyad: Kullanici.Soyad,
      Telefon: Kullanici.Telefon,
      KullaniciAdi: Kullanici.KullaniciAdi,
      Rol: Kullanici.Rol,
    });
  });
});

router.get("/yonetici-yap/:KullaniciAdi", (req, res) => {
  const { KullaniciAdi } = req.params;

  const query = `UPDATE Kullanici SET Rol = ? WHERE KullaniciAdi = ?`;

  db.run(query, ["Yonetici", KullaniciAdi], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }

    if (this.changes === 0) {
      return res.status(404).send("Kullanıcı bulunamadı");
    }

    res.sendStatus(204);
  });
});

router.get("/", authorize(["Yonetici"]), (req, res) => {
  const query = `SELECT * FROM Kullanici`;
  db.all(query, (err, Kullanicis) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    res.json(Kullanicis);
  });
});

function ucwords(str) {
  strVal = "";
  str = str.toLocaleLowerCase().split(" ");
  for (let chr = 0; chr < str.length; chr++) {
    strVal +=
      str[chr].substring(0, 1).toLocaleUpperCase() +
      str[chr].substring(1, str[chr].length) +
      " ";
  }
  return strVal;
}

module.exports = router;
