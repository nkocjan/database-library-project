const express = require("express");
const router = express.Router();
const pool = require("../db");
const generateBookQuery = require("../utils/queries/generateBookQuery");
const getBibliotekiAndKategorie = require("../utils/queries/filtryBiblioKat");
const wypozyczKsiazke = require("../utils/queries/wypozyczKsiazke");

router.get("/", async (req, res) => {
  try {
    const ksiazkiResult = await pool.query(
      "SELECT * FROM project.widok_ksiazki"
    );
    const ksiazki = ksiazkiResult.rows;

    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();
    res.render("books", {
      title: "Przeglądaj książki",
      cssFile: "books.css",
      kategorie,
      ksiazki,
      biblioteki,
    });
  } catch (err) {
    res.render("books", {
      title: "Przeglądaj książki",
      cssFile: "books.css",
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

router.post("/", async (req, res) => {
  try {
    const { query, params } = generateBookQuery(req.body);
    const ksiazkiResult = await pool.query(query, params);
    const ksiazki = ksiazkiResult.rows;

    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();

    res.render("books", {
      title: "Przeglądaj książki",
      cssFile: "books.css",
      kategorie,
      ksiazki,
      biblioteki,
    });
  } catch (err) {
    res.render("books", {
      title: "Przeglądaj książki",
      cssFile: "books.css",
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

router.post("/wypozycz", async (req, res) => {
  const {
    imie,
    nazwisko,
    nr_karty_bibliotecznej,
    kod_ksiazki,
    wypozycz_biblioteke,
  } = req.body;

  try {
    const result = await wypozyczKsiazke(
      imie,
      nazwisko,
      nr_karty_bibliotecznej,
      kod_ksiazki,
      parseInt(wypozycz_biblioteke, 10)
    );

    const ksiazkiResult = await pool.query(
      "SELECT * FROM project.widok_ksiazki"
    );
    const ksiazki = ksiazkiResult.rows;

    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();
    res.render("books", {
      title: "Przeglądaj książki",
      cssFile: "books.css",
      kategorie,
      ksiazki,
      biblioteki,
      toast: {
        title: result.title,
        body: result.body,
      },
    });
  } catch (err) {
    res.render("books", {
      title: "Przeglądaj książki",
      cssFile: "books.css",
      kategorie: [],
      ksiazki: [],
      biblioteki: [],
      toast: {
        title: "Error",
        body: `Błąd podczas połączenia z bazą danych ${err.message}`,
      },
    });
  }
});

module.exports = router;
