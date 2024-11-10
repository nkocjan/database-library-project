const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
  res.render("admin_views/add_user", { title: "Dodaj uzytkownika", cssFile: 'admin_add_user.css' });
});

module.exports = router;