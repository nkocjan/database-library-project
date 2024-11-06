// Lista książek
// Dodawanie nowej książki - tytuł, rok wydania, dziedzina, wydawnictwo, liczba kopii, dostępnych kopii
// Szczegóły książki - Widok szczegółowy danej książki tytuł, autorzy, dziedzina, wydawnictwo, liczba dostępnych kopii
// Edycja książki
// Usuwanie książki

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("book", { title: "Książki" });
});

module.exports = router;