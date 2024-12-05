const express = require("express");
const router = express.Router();
const requireAuth = require("../../public/scripts/requireAuth");
const getBibliotekiAndKategorie = require("../../utils/queries/filtryBiblioKat");
const pool = require("../../db");
const generujKodKsiazki = require("../../utils/generujKodKsiazki");
const updateWidokKsiazki = require("../../utils/update_view/aktualizujWidokKsiazki");

router.get("/", requireAuth, async (req, res) => {
  try {
    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();

    const autorzyResult = await pool.query("SELECT * FROM project.autor");
    const autorzy = autorzyResult.rows;

    res.render("admin_views/add_book", {
      title: "Dodaj książkę",
      cssFile: "admin_add_book.css",
      autorzy,
      kategorie,
      biblioteki,
    });
  } catch (err) {
    res.render("admin_views/add_book", {
      title: "Dodaj książkę",
      cssFile: "admin_add_book.css",
      autorzy: [],
      kategorie: [],
      biblioteki: [],
      toast: {
        title: "Error",
        body: `Błąd podczas łączenia z bazą danych ${err}`,
      },
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { imie, autor, kategoria, data_wydania } = req.body;
  const rokWydania = new Date(data_wydania).getFullYear().toString();
  try {
    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();

    const autorzyResult = await pool.query("SELECT * FROM project.autor");
    const autorzy = autorzyResult.rows;

    const checkBookQuery = `
      SELECT ksiazka_id 
      FROM project.ksiazka 
      WHERE tytul = $1 AND rok_wydania = $2 AND kategoria_id = $3;
    `;
    const checkBookResult = await pool.query(checkBookQuery, [
      imie,
      rokWydania,
      kategoria,
    ]);

    if (checkBookResult.rowCount > 0) {
      return res.render("admin_views/add_book", {
        title: "Dodaj książkę",
        cssFile: "admin_add_book.css",
        toast: {
          title: "Error",
          body: "Książka już istnieje w systemie.",
        },
        autorzy,
        kategorie,
        biblioteki,
      });
    }

    let kod = await generujKodKsiazki();

    const insertBookQuery = `
      INSERT INTO project.ksiazka (tytul, kategoria_id, rok_wydania, kod) 
      VALUES ($1, $2, $3, $4) 
      RETURNING ksiazka_id;
    `;
    const insertBookResult = await pool.query(insertBookQuery, [
      imie,
      kategoria,
      rokWydania,
      kod,
    ]);

    const ksiazka_id = insertBookResult.rows[0].ksiazka_id;

    const insertAuthorBookQuery = `
      INSERT INTO project.ksiazka_autor (ksiazka_id, autor_id) 
      VALUES ($1, $2);
    `;
    await pool.query(insertAuthorBookQuery, [ksiazka_id, autor]);

    await updateWidokKsiazki();

    res.render("admin_views/add_book", {
      title: "Dodaj książkę",
      cssFile: "admin_add_book.css",
      toast: {
        title: "Sukces",
        body: `Dodano książkę o ID: ${ksiazka_id}`,
      },
      autorzy,
      kategorie,
      biblioteki,
    });
  } catch (err) {
    console.error(err.message);
    res.render("admin_views/add_book", {
      title: "Dodaj książkę",
      cssFile: "admin_add_book.css",
      toast: {
        title: "Error",
        body: `Błąd podczas dodawania książki: ${err.message}`,
      },
      autorzy: [],
      kategorie: [],
      biblioteki: [],
    });
  }
});

router.post("/egzemplarze", requireAuth, async (req, res) => {
  const { kod, biblioteka, ilosc } = req.body;

  try {
    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();

    const autorzyResult = await pool.query("SELECT * FROM project.autor");
    const autorzy = autorzyResult.rows;

    const bookQuery = `SELECT ksiazka_id FROM project.ksiazka WHERE kod = $1`;
    const bookResult = await pool.query(bookQuery, [kod]);

    if (bookResult.rowCount === 0) {
      return res.status(404).render("error_view", {
        title: "Błąd",
        message: "Nie znaleziono książki o podanym kodzie.",
      });
    }

    const ksiazka_id = bookResult.rows[0].ksiazka_id;

    // Dodanie egzemplarzy
    const insertEgzemplarzQuery = `
      INSERT INTO project.egzemplarz (ksiazka_id, biblioteka_id, stan, data_nabycia)
      VALUES ($1, $2, 'Nowy', CURRENT_DATE)
    `;
    for (let i = 0; i < ilosc; i++) {
      await pool.query(insertEgzemplarzQuery, [ksiazka_id, biblioteka]);
    }

    await updateWidokKsiazki();

    res.render("admin_views/add_book", {
      title: "Dodaj książkę",
      cssFile: "admin_add_book.css",
      autorzy,
      kategorie,
      biblioteki,
      toast: {
        title: "Sukces",
        body: `Zamówiono egzemplarze`,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).render("error_view", {
      title: "Błąd",
      message: "Wystąpił problem podczas zamawiania egzemplarzy.",
    });
  }
});

module.exports = router;
