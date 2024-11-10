const express = require("express");
const router = express.Router();

const autorzy = [
  { id: 1, imie: 'Henryk', nazwisko: 'Sienkiewicz' },
  { id: 2, imie: 'William', nazwisko: 'Shakespeare' },
  { id: 3, imie: 'J.R.R.', nazwisko: 'Tolkien' },
];

const kategorie = [
  { nazwa: 'Przygodowa' },
  { nazwa: 'Dramat' },
  { nazwa: 'Fantasy' },
];

const biblioteki = [
  { id: 1, miejscowosc: 'Warszawa' },
  { id: 2, miejscowosc: 'Kraków' },
  { id: 3, miejscowosc: 'Wrocław' },
];

router.get("/", (req, res) => {
  res.render("admin_views/add_book", { title: "Dodaj książkę", cssFile: 'admin_add_book.css', autorzy, kategorie, biblioteki });
});

module.exports = router;