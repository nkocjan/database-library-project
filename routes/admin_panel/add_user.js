const express = require("express");
const router = express.Router();
const requireAuth = require("../../public/scripts/requireAuth");
const pool = require("../../db");

router.get("/", requireAuth, (req, res) => {
  return res.render("admin_views/add_user", {
    title: "Dodaj uzytkownika",
    cssFile: "admin_add_user.css",
  });
});

router.post("/", requireAuth, async (req, res) => {
  const { imie, nazwisko, data_urodzenia } = req.body;

  try {
    const birthDate = new Date(data_urodzenia);
    const cutoffDate = new Date("2018-01-01");

    if (birthDate >= cutoffDate) {
      return res.render("admin_views/add_user", {
        title: "Dodaj użytkownika",
        cssFile: "admin_add_user.css",
        toast: {
          title: "Error",
          body: "Data urodzenia musi być wcześniejsza niż 01.01.2018",
        },
      });
    }

    await pool.query("BEGIN");

    const dateParts = data_urodzenia.split("-");
    const nr_karty_bibliotecznej = `${dateParts[2]}${dateParts[1]}${dateParts[0]}`;

    const checkUserQuery = `
      SELECT uzytkownik_id 
      FROM project.uzytkownik 
      WHERE imie = $1 AND nazwisko = $2 AND data_urodzenia = $3;
    `;
    const checkUserResult = await pool.query(checkUserQuery, [
      imie,
      nazwisko,
      data_urodzenia,
    ]);

    if (checkUserResult.rowCount > 0) {
      await pool.query("ROLLBACK");
      return res.render("admin_views/add_user", {
        title: "Dodaj użytkownika",
        cssFile: "admin_add_user.css",
        toast: {
          title: "Error",
          body: "Użytkownik już istnieje",
        },
      });
    }

    const insertUserQuery = `
      INSERT INTO project.uzytkownik (imie, nazwisko, data_urodzenia, nr_karty_bibliotecznej) 
      VALUES ($1, $2, $3, $4) 
      RETURNING uzytkownik_id;
    `;
    const insertUserResult = await pool.query(insertUserQuery, [
      imie,
      nazwisko,
      data_urodzenia,
      nr_karty_bibliotecznej,
    ]);

    await pool.query("COMMIT");

    const uzytkownikId = insertUserResult.rows[0].uzytkownik_id;

    return res.render("admin_views/add_user", {
      title: "Dodaj użytkownika",
      cssFile: "admin_add_user.css",
      toast: {
        title: "Sukces",
        body: `Dodano użytkownika o ID: ${uzytkownikId}, nr karty: ${nr_karty_bibliotecznej}`,
      },
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.render("admin_views/add_user", {
      title: "Dodaj użytkownika",
      cssFile: "admin_add_user.css",
      toast: {
        title: "Error",
        body: `Błąd podczas połączenia z bazą danych: ${err.message}`,
      },
    });
  }
});

module.exports = router;
