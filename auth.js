const jwt = require("jsonwebtoken");
const db = require("./db");
const SECRET_KEY = "Nv3rySeCR@";

function authorize(Roller = []) {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY);
      const query = `SELECT * FROM Kullanici WHERE KullaniciAdi = ?`;
      db.get(query, [decodedToken.KullaniciAdi], async (err, Kullanici) => {
        if (Roller.length && !Roller.includes(Kullanici.Rol)) {
          return res.status(403).send("Forbidden");
        }
        req.Kullanici = Kullanici;
        next();
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  };
}

module.exports = { jwt, SECRET_KEY, authorize };
