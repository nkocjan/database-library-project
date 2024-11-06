const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("publishing", { title: "Lista wydawnictw" });
});

module.exports = router;
