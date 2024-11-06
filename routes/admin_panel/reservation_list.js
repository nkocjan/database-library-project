const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("reservation_list", { title: "Lista rezerwacji" });
});

module.exports = router;