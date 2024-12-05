const express = require("express");
const router = express.Router();
const pool = require("../db");
const registerValidate = require("../utils/registerValidate");

router.get("/", async (req, res) => {
  try {
    const bibliotekiResult = await pool.query(
      "SELECT * FROM project.biblioteka"
    );
    const biblioteki = bibliotekiResult.rows;

    res.render("register", {
      title: "Zarejestruj się",
      cssFile: "register.css",
      biblioteki,
    });
  } catch (err) {
    res.render("register", {
      title: "Zarejestruj się",
      cssFile: "register.css",
      biblioteki: [],
      toast: {
        title: "Error",
        body: "Błąd podczas wczytywania bibliotek. Skontaktuj się z administratorem",
      },
    });
  }
});

router.post("/", async (req, res) => {
  const { login, password, email, phone } = req.body;
  const biblioteki = req.body.biblioteki || [];

  try {
    const bibliotekiResult = await pool.query(
      "SELECT * FROM project.biblioteka"
    );
    const bibliotekiResponse = bibliotekiResult.rows;

    const validationResponse = await registerValidate({
      login,
      password,
      email,
      phone,
      biblioteki,
    });

    if (!validationResponse.isOk) {
      return res.render("register", {
        title: "Zarejestruj się",
        cssFile: "register.css",
        biblioteki: bibliotekiResponse,
        toast: {
          title: validationResponse.title,
          body: validationResponse.message,
        },
      });
    }

    const adminQuery = `INSERT INTO project.administrator (login, haslo, email, telefon) VALUES ($1, $2, $3, $4) RETURNING administrator_id`;

    const adminValues = [
      login,
      password,
      email || null,
      phone.replace(/\s/g, ""),
    ];
    const adminResult = await pool.query(adminQuery, adminValues);
    const administratorId = adminResult.rows[0].administrator_id;

    const zarzadzanieInsertQuery = `INSERT INTO project.zarzadzanie (biblioteka_id, administrator_id) VALUES ($1, $2)`;
    for (const bibliotekaId of biblioteki) {
      await pool.query(zarzadzanieInsertQuery, [bibliotekaId, administratorId]);
    }

    req.session.user = { login };

    res.render("admin_views/admin_panel", {
      title: "Panel administratora",
      cssFile: "admin_panel.css",
      biblioteki: bibliotekiResponse,
      toast: {
        title: "Success",
        body: `Poprawnie zarejestrowano. Witaj ${req.session.user}`,
      },
    });
  } catch (err) {
    res.render("register", {
      title: "Zarejestruj się",
      cssFile: "register.css",
      biblioteki: [],
      toast: {
        title: "Error",
        body: `Błąd podczas połączenia z bazą danych. Skontaktuj się z administratorem. ${err}`,
      },
    });
  }
});

module.exports = router;
