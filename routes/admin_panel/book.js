const express = require("express");
const router = express.Router();
const requireAuth = require('../../public/scripts/requireAuth')

const ksiazki = [
  {
    tytul: 'W pustyni i w puszczy',
    rok_wydania: 1911,
    kategoria: 'Przygodowa',
    autor: 'Henryk Sienkiewicz',
    dostepne: 5,
    wszystkie: 10,
    biblioteka: 'Biblioteka Miejska w Warszawie'
  },
  {
    tytul: 'Pan Tadeusz',
    rok_wydania: 1834,
    kategoria: 'Epika',
    autor: 'Adam Mickiewicz',
    dostepne: 2,
    wszystkie: 8,
    biblioteka: 'Biblioteka Narodowa w Krakowie'
  },
  {
    tytul: 'Dziady',
    rok_wydania: 1823,
    kategoria: 'Dramat',
    autor: 'Adam Mickiewicz',
    dostepne: 3,
    wszystkie: 6,
    biblioteka: 'Biblioteka Uniwersytecka we Wrocławiu'
  },
  {
    tytul: 'Lalka',
    rok_wydania: 1890,
    kategoria: 'Powieść',
    autor: 'Bolesław Prus',
    dostepne: 4,
    wszystkie: 9,
    biblioteka: 'Biblioteka Publiczna w Poznaniu'
  },
  {
    tytul: 'Quo Vadis',
    rok_wydania: 1896,
    kategoria: 'Powieść historyczna',
    autor: 'Henryk Sienkiewicz',
    dostepne: 6,
    wszystkie: 12,
    biblioteka: 'Biblioteka Wojewódzka w Gdańsku'
  }
];

const kategorie = [
  { id: 1, nazwa: 'Przygodowa' },
  { id: 2, nazwa: 'Dramat' },
  { id: 3, nazwa: 'Fantasy' },
  { id: 4, nazwa: 'Sci-Fi' },
  { id: 5, nazwa: 'Biografia' },
];

router.get("/",requireAuth, (req, res) => {
  res.render("admin_views/book", { title: "Książki", cssFile: 'admin_book.css', ksiazki: ksiazki, kategorie: kategorie });
});

module.exports = router;