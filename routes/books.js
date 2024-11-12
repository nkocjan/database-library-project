const express = require("express");
const router = express.Router();
const pool = require('../db');

router.get("/", async (req, res) => {
  try {
    const ksiazkiResult = await pool.query("SELECT * FROM project.ksiazka");
    const kategorieResult = await pool.query("SELECT * FROM project.kategoria");

    const ksiazki = ksiazkiResult.rows;
    const kategorie = kategorieResult.rows;

    console.log(ksiazki[0]);
    console.log(kategorie[0]);
    console.log('xd')

    res.render("books", { 
      title: "Przeglądaj książki", 
      cssFile: 'books.css', 
      kategorie, 
      ksiazki,
    })
  } catch(err) {
    res.render("books", { 
      title: "Przeglądaj książki", 
      cssFile: 'books.css', 
      kategorie: [], 
      ksiazki: [],
      toast: {
        title: 'Error',
        body: 'Błąd podczas pobierania listy książek oraz kategorii'
      }
    })
  }

});

module.exports = router;
