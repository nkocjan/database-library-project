const express = require("express");
const router = express.Router();
const ksiazki = [
  {
    tytul: 'W pustyni i w puszczy',
    rok_wydania: 1911,
    kategoria: 'Przygodowa',
    autor: 'Henryk Sienkiewicz',
    dostepne: 5,
    wszystkie: 10,
    biblioteka: 'Biblioteka Miejska w Warszawie',
    code: 1
  },
  {
    tytul: 'Pan Tadeusz',
    rok_wydania: 1834,
    kategoria: 'Epika',
    autor: 'Adam Mickiewicz',
    dostepne: 2,
    wszystkie: 8,
    biblioteka: 'Biblioteka Narodowa w Krakowie',
    code: 2
  },
  {
    tytul: 'Dziady',
    rok_wydania: 1823,
    kategoria: 'Dramat',
    autor: 'Adam Mickiewicz',
    dostepne: 3,
    wszystkie: 6,
    biblioteka: 'Biblioteka Uniwersytecka we Wrocławiu',
    code: 3
  },
  {
    tytul: 'Lalka',
    rok_wydania: 1890,
    kategoria: 'Powieść',
    autor: 'Bolesław Prus',
    dostepne: 4,
    wszystkie: 9,
    biblioteka: 'Biblioteka Publiczna w Poznaniu',
    code: 4
  },
  {
    tytul: 'Quo Vadis',
    rok_wydania: 1896,
    kategoria: 'Powieść historyczna',
    autor: 'Henryk Sienkiewicz',
    dostepne: 6,
    wszystkie: 12,
    biblioteka: 'Biblioteka Wojewódzka w Gdańsku',
    code: 5
  }
];

const kategorie = [
  { id: 1, nazwa: 'Przygodowa' },
  { id: 2, nazwa: 'Dramat' },
  { id: 3, nazwa: 'Fantasy' },
  { id: 4, nazwa: 'Sci-Fi' },
  { id: 5, nazwa: 'Biografia' },
];

router.get("/", (req, res) => {
  res.render("books", { title: "Przeglądaj książki", cssFile: 'books.css', kategorie, ksiazki });
});

module.exports = router;
