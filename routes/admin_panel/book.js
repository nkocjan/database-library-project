const express = require("express");
const router = express.Router();
const requireAuth = require("../../public/scripts/requireAuth");
const getBibliotekiAndKategorie = require("../../utils/queries/filtryBiblioKat");
const generateBookQuery = require("../../utils/queries/generateBookQuery");
const pool = require("../../db");

router.get("/", requireAuth, async (req, res) => {
  try {
    const ksiazkiResult = await pool.query(
      "SELECT * FROM project.widok_ksiazki"
    );
    const ksiazki = ksiazkiResult.rows;

    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();
    res.render("admin_views/book", {
      title: "Książki",
      cssFile: "admin_book.css",
      kategorie,
      ksiazki,
      biblioteki,
    });
  } catch (err) {
    res.render("admin_views/book", {
      title: "Książki",
      cssFile: "admin_book.css",
      kategorie: [],
      ksiazki: [],
      biblioteki: [],
      toast: {
        title: "Error",
        body: `Błąd podczas pobierania listy książek oraz kategorii. ${err}`,
      },
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { query, params } = generateBookQuery(req.body);
    const ksiazkiResult = await pool.query(query, params);
    const ksiazki = ksiazkiResult.rows;

    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();

    res.render("admin_views/book", {
      title: "Książki",
      cssFile: "admin_book.css",
      kategorie,
      ksiazki,
      biblioteki,
    });
  } catch (err) {
    res.render("admin_views/book", {
      title: "Książki",
      cssFile: "admin_book.css",
      kategorie: [],
      ksiazki: [],
      biblioteki: [],
      toast: {
        title: "Error",
        body: "Błąd podczas pobierania listy książek oraz kategorii",
      },
    });
  }
});

module.exports = router;
