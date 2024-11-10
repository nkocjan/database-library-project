const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
  res.render("admin_views/add_author", { title: "Dodaj autora", cssFile: 'admin_add_author.css' });
});

module.exports = router;