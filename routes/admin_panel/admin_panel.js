const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin_panel", { title: "Panel administratora" });
});

module.exports = router;
