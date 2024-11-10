const express = require("express");
const router = express.Router();

const kategorie = [
  {
    nazwa: 'Przygodowa',
    ilosc: 120,
    autor: 'Henryk Sienkiewicz'
  },
  {
    nazwa: 'Dramat',
    ilosc: 85,
    autor: 'William Shakespeare'
  },
  {
    nazwa: 'Fantasy',
    ilosc: 200,
    autor: 'J.R.R. Tolkien'
  },
  {
    nazwa: 'Sci-Fi',
    ilosc: 150,
    autor: 'Isaac Asimov'
  },
  {
    nazwa: 'Biografia',
    ilosc: 65,
    autor: 'Walter Isaacson'
  },
  {
    nazwa: 'Kryminał',
    ilosc: 95,
    autor: 'Agatha Christie'
  },
  {
    nazwa: 'Horror',
    ilosc: 70,
    autor: 'Stephen King'
  },
  {
    nazwa: 'Romans',
    ilosc: 130,
    autor: 'Nicholas Sparks'
  }
];


router.get("/", (req, res) => {
  res.render("admin_views/category", { title: "Kategorie", cssFile: 'admin_category.css', kategorie: kategorie });
});

module.exports = router;