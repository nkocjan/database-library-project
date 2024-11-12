const express = require("express");
const router = express.Router();
const requireAuth = require('../../public/scripts/requireAuth')

const uzytkownicy = [
  {
    imie: 'Jan',
    nazwisko: 'Kowalski',
    data_urodzenia: '1985-06-15',
    card: '1234567890'
  },
  {
    imie: 'Anna',
    nazwisko: 'Nowak',
    data_urodzenia: '1992-04-22',
    card: '2345678901'
  },
  {
    imie: 'Michał',
    nazwisko: 'Wiśniewski',
    data_urodzenia: '1978-12-03',
    card: '3456789012'
  },
  {
    imie: 'Katarzyna',
    nazwisko: 'Zielińska',
    data_urodzenia: '2000-09-14',
    card: '4567890123'
  },
  {
    imie: 'Piotr',
    nazwisko: 'Mazur',
    data_urodzenia: '1983-02-28',
    card: '5678901234'
  },
  {
    imie: 'Monika',
    nazwisko: 'Kamińska',
    data_urodzenia: '1995-07-19',
    card: '6789012345'
  }
];


router.get("/", (req, res) => {
  res.render("admin_views/users", requireAuth, { title: "Kategorie", cssFile: 'admin_users.css', uzytkownicy });
});

module.exports = router;