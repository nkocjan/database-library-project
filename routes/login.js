const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  res.render("login", { title: "Zaloguj się", cssFile: "login.css" });
});

router.post("/", (req, res) => {
  const { login, password } = req.body;

  req.session.user = {login}

  res.send("Logowanie zakończone");
});

module.exports = router;
