const express = require("express");
const router = express.Router();
const initDataBase = require("../public/scripts/init2");

router.get("/", (req, res) => {
  res.send("Wrong path");
});

router.post("/", async (req, res) => {
  try {
    const isOk = await initDataBase();
    if (isOk) {
      res.render("main", {
        toast: {
          title: "Success",
          body: "Poprawnie zrestartowano bazę danych",
        },
        title: "Strona główna",
        cssFile: "main.css",
      });
    } else {
      res.render("main", {
        toast: {
          title: "Error",
          body: "Błąd podczas resetowania bazy danych",
        },
        title: "Strona główna",
        cssFile: "main.css",
      });
    }
  } catch (error) {
    res.render("main", {
      toast: {
        title: "Error",
        body: "Błąd podczas resetowania bazy danych",
      },
      title: "Strona główna",
      cssFile: "main.css",
    });
  }
});

module.exports = router;
