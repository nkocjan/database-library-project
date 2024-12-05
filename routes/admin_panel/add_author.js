const express = require("express");
const router = express.Router();
const requireAuth = require("../../public/scripts/requireAuth");
const pool = require("../../db");

router.get("/", requireAuth, (req, res) => {
  res.render("admin_views/add_author", {
    title: "Dodaj autora",
    cssFile: "admin_add_author.css",
  });
});

router.post("/", requireAuth, async (req, res) => {
  const { imie, nazwisko, narodowosc } = req.body;

  try {
    await pool.query("BEGIN");

    const checkAuthorQuery = `
      SELECT autor_id 
      FROM autor 
      WHERE imie = $1 AND nazwisko = $2 AND narodowosc = $3;
    `;
    const checkAuthorResult = await pool.query(checkAuthorQuery, [
      imie,
      nazwisko,
      narodowosc,
    ]);

    if (checkAuthorResult.rowCount > 0) {
      await pool.query("ROLLBACK");
      res.render("admin_views/add_author", {
        title: "Dodaj autora",
        cssFile: "admin_add_author.css",
        toast: {
          title: "Error",
          body: "Autor już istnieje",
        },
      });
    }

    const insertAuthorQuery = `
      INSERT INTO autor (imie, nazwisko, narodowosc) 
      VALUES ($1, $2, $3) 
      RETURNING autor_id;
    `;
    const insertAuthorResult = await pool.query(insertAuthorQuery, [
      imie,
      nazwisko,
      narodowosc,
    ]);

    await pool.query("COMMIT");

    const autorId = insertAuthorResult.rows[0].autor_id;

    res.render("admin_views/add_author", {
      title: "Dodaj autora",
      cssFile: "admin_add_author.css",
      toast: {
        title: "Sukces",
        body: `Dodano autora o id : ${autorId}`,
      },
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.render("admin_views/add_author", {
      title: "Dodaj autora",
      cssFile: "admin_add_author.css",
      toast: {
        title: "Error",
        body: `Błąd podczas połączenia z bazą danych ${err}`,
      },
    });
  }
});

module.exports = router;
