const bcrypt = require("bcrypt");
const { jwt, SECRET_KEY } = require("../auth");
const db = require("../db");

const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async function (err, row) {
        if (row) {
          return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.run(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hashedPassword, "user"],
          function (err) {
            if (err) {
              return res.status(500).send("Server error");
            }

            const token = jwt.sign({ id: this.lastID }, SECRET_KEY, {
              expiresIn: "24h",
            });
            res.json({ token });
          }
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, row.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "24h",
    });

    res.json({ token });
  });
});

module.exports = router;
