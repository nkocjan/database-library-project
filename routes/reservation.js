const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("reservation", { title: "Zarezerwuj książkę" });
});

module.exports = router;
