const express = require("express");
const router = express.Router();
const requireAuth = require('../../public/scripts/requireAuth')

router.get("/", requireAuth, (req, res) => {
  res.render("admin_views/admin_panel", { title: "Panel administratora", cssFile: "admin_panel.css" });
});

module.exports = router;
