const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("main", { title: "Strona główna", cssFile: "main.css" });
});

module.exports = router;
