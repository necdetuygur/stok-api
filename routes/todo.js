const db = require("../db");
const { authorize } = require("../auth");
const express = require("express");
const router = express.Router();

router.get("/", authorize(["admin"]), (req, res) => {
  const query = `SELECT * FROM todos WHERE user_id = ?`;

  db.all(query, [req.user.userId], (err, todos) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }

    res.json(todos);
  });
});

router.post("/", authorize(["admin"]), (req, res) => {
  const { title, description, completed } = req.body;

  const query = `INSERT INTO todos (title, description, completed, user_id) VALUES (?, ?, ?, ?)`;

  db.run(
    query,
    [title, description, completed, req.user.userId],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }

      const todoId = this.lastID;

      res.status(201).json({
        id: todoId,
        title,
        description,
        completed,
        user_id: req.user.userId,
      });
    }
  );
});

router.put("/:id", authorize(["admin"]), (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const query = `UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?`;

  db.run(
    query,
    [title, description, completed, id, req.user.userId],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }

      if (this.changes === 0) {
        return res.status(404).send("Todo not found");
      }

      res.sendStatus(204);
    }
  );
});

router.delete("/:id", authorize(["admin"]), (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM todos WHERE id = ? AND user_id = ?`;

  db.run(query, [id, req.user.userId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }

    if (this.changes === 0) {
      return res.status(404).send("Todo not found");
    }

    res.sendStatus(204);
  });
});

module.exports = router;
