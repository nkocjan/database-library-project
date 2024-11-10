const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin_views/admin_panel", { title: "Panel administratora", cssFile: "admin_panel.css" });
});

module.exports = router;
