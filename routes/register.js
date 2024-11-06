const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("register", { title: "Zarejestruj się", cssFile: "register.css" });
});

router.post("/", (req, res) => {
  const { login, password, email, phone } = req.body;

  res.send("Zarejestrowano administratora");
});

module.exports = router;
