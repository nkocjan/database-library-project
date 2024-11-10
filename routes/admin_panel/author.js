const express = require("express");
const router = express.Router();
// Przykładowe dane autorów
const authors = [
  { firstName: 'Jan', lastName: 'Kowalski', nationality: 'Polska', bookCount: 5 },
  { firstName: 'Anna', lastName: 'Nowak', nationality: 'Polska', bookCount: 3 },
  { firstName: 'John', lastName: 'Doe', nationality: 'USA', bookCount: 7 },
  { firstName: 'Marie', lastName: 'Curie', nationality: 'Francja', bookCount: 2 },
  { firstName: 'Nina', lastName: 'Ivanova', nationality: 'Rosja', bookCount: 4 },
];

router.get("/", (req, res) => {
  res.render("admin_views/author", { title: "Autorzy", cssFile: 'admin_author.css', autorzy: authors });
});

module.exports = router;
