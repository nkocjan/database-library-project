const express = require("express");
const router = express.Router();

const kategorie = [
  { id: 1, nazwa: 'Przygodowa' },
  { id: 2, nazwa: 'Dramat' },
  { id: 3, nazwa: 'Fantasy' },
  { id: 4, nazwa: 'Sci-Fi' },
  { id: 5, nazwa: 'Biografia' },
];

const biblioteki = [
  { id: 1, nazwa: 'Narama' },
  { id: 2, nazwa: 'Iwanowice Dworskie' },
  { id: 3, nazwa: 'Iwanowice Włościańskie' },
  { id: 4, nazwa: 'Maszków' },
  { id: 5, nazwa: 'Michałowice' },
]

const wypozyczenia = [
  {
    tytul: 'W pustyni i w puszczy',
    kategoria: 'Przygodowa',
    autor: 'Henryk Sienkiewicz',
    biblioteka: 'Biblioteka Miejska w Warszawie',
    code: 'WPIP001',
    data_wypozyczenia: '2023-10-01',
    data_zwrotu: '2023-10-15',
    oddano: 'Tak'
  },
  {
    tytul: 'Pan Tadeusz',
    kategoria: 'Epika',
    autor: 'Adam Mickiewicz',
    biblioteka: 'Biblioteka Narodowa w Krakowie',
    code: 'PTAD002',
    data_wypozyczenia: '2023-09-20',
    data_zwrotu: '2023-10-05',
    oddano: 'Nie'
  },
  {
    tytul: 'Lalka',
    kategoria: 'Powieść',
    autor: 'Bolesław Prus',
    biblioteka: 'Biblioteka Publiczna w Poznaniu',
    code: 'LALKA003',
    data_wypozyczenia: '2023-09-10',
    data_zwrotu: '2023-09-25',
    oddano: 'Tak'
  },
  {
    tytul: 'Quo Vadis',
    kategoria: 'Powieść historyczna',
    autor: 'Henryk Sienkiewicz',
    biblioteka: 'Biblioteka Wojewódzka w Gdańsku',
    code: 'QVAD004',
    data_wypozyczenia: '2023-08-15',
    data_zwrotu: '2023-08-30',
    oddano: 'Tak'
  },
  {
    tytul: 'Dziady',
    kategoria: 'Dramat',
    autor: 'Adam Mickiewicz',
    biblioteka: 'Biblioteka Uniwersytecka we Wrocławiu',
    code: 'DZAD005',
    data_wypozyczenia: '2023-09-05',
    data_zwrotu: '2023-09-20',
    oddano: 'Nie'
  },
  {
    tytul: 'Przedwiośnie',
    kategoria: 'Powieść',
    autor: 'Stefan Żeromski',
    biblioteka: 'Biblioteka Miejska w Łodzi',
    code: 'PRZW006',
    data_wypozyczenia: '2023-07-10',
    data_zwrotu: '2023-07-25',
    oddano: 'Tak'
  }
];


router.get("/", (req, res) => {
  res.render("wypozyczenia", { title: "Przeglądaj wypożyczenia", cssFile: 'wypozyczenia.css', wypozyczenia, kategorie, biblioteki});
});

module.exports = router;
