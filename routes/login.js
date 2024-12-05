const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/logout");
  } else {
    res.render("login", { title: "Zaloguj się", cssFile: "login.css" });
  }
});

router.post("/", async (req, res) => {
  const { login, password } = req.body;

  try {
    const query = `SELECT login FROM project.administrator WHERE login = $1 AND haslo = $2`;

    const values = [login, password];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      req.session.user = { login };
      res.redirect("admin/admin_panel");
    } else {
      res.render("login", {
        title: "Zaloguj się",
        cssFile: "login.css",
        toast: {
          title: "Error",
          body: `Podano błędny login, lub hasło`,
        },
      });
    }
  } catch (err) {
    res.render("login", {
      title: "Zaloguj się",
      cssFile: "login.css",
      toast: {
        title: "Error",
        body: `Błąd podczas połączenia z bazą danych. Skontaktuj się z administratorem`,
      },
    });
  }
});

module.exports = router;
