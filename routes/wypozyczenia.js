const express = require("express");
const router = express.Router();
const getBibliotekiAndKategorie = require("../utils/queries/filtryBiblioKat");
const pool = require("../db");
const formatujDate = require("../utils/formatujDate");
const requireAuth = require("../public/scripts/requireAuth");
const aktualizujWidokKsiazki = require("../utils/update_view/aktualizujWidokKsiazki");
const aktualizujWidokWypozyczenia = require("../utils/update_view/aktualizujWidokWypozyczenia");

router.get("/", (req, res) => {
  res.send("Unauthorized connection. Get out");
});

router.post("/", async (req, res) => {
  const {
    zobacz_wypozyczenia_imie,
    zobacz_wypozyczenia_nazwisko,
    zobacz_wypozyczenia_data_urodzenia,
    zobacz_wypozyczenia_nr_karty,
  } = req.body;

  const adminLogin = req.session.user || null;

  try {
    const { kategorie, biblioteki } = await getBibliotekiAndKategorie();
    const ksiazkiResult = await pool.query(
      "SELECT * FROM project.widok_ksiazki"
    );
    const ksiazki = ksiazkiResult.rows;
    const userQuery = `
    SELECT * FROM project.uzytkownik 
    WHERE imie = $1 
      AND nazwisko = $2 
      AND data_urodzenia = $3 
      AND nr_karty_bibliotecznej = $4
    `;
    const userResult = await pool.query(userQuery, [
      zobacz_wypozyczenia_imie,
      zobacz_wypozyczenia_nazwisko,
      zobacz_wypozyczenia_data_urodzenia,
      zobacz_wypozyczenia_nr_karty,
    ]);

    if (userResult.rowCount === 0) {
      return res.render("books", {
        title: "Przeglądaj książki",
        cssFile: "books.css",
        kategorie,
        biblioteki,
        ksiazki,
        toast: {
          title: "Error",
          body: "Nie znaleziono użytkownika o podanych danych. Upewnij się, że dane są poprawne.",
        },
      });
    }

    const wypozyczeniaQuery = `
    SELECT * FROM project.widok_wypozyczen 
    WHERE numer_karty_bibliotecznej = $1
    `;

    const wypozyczeniaResult = await pool.query(wypozyczeniaQuery, [
      zobacz_wypozyczenia_nr_karty,
    ]);

    for (let i = 0; i < wypozyczeniaResult.rows.length; i++) {
      const row = wypozyczeniaResult.rows[i];
      row.start = row.start ? formatujDate(row.start) : null;
      row.koniec = row.koniec ? formatujDate(row.koniec) : null;
      row.zwrot = row.zwrot ? formatujDate(row.zwrot) : null;
    }

    return res.render("wypozyczenia", {
      title: "Twoje wypożyczenia",
      cssFile: "wypozyczenia.css",
      wypozyczenia: wypozyczeniaResult.rows,
      adminLogin,
      toast: {
        title: "Success",
        body: `Znaleziono ${wypozyczeniaResult.rowCount} wypożyczeń dla użytkownika.`,
      },
    });
  } catch (err) {
    console.error(err);
    res.render("books", {
      title: "Przeglądaj książki",
      cssFile: "books.css",
      kategorie: [],
      biblioteki: [],
      ksiazki: [],
      toast: {
        title: "Error",
        body: `Wystąpił błąd podczas przetwarzania żądania. Skontaktuj się z administratorem. ${err.message}`,
      },
    });
  }
});

router.post("/zwroc", requireAuth, async (req, res) => {
  const { wypozyczenie_id, numer_karty_bibliotecznej } = req.body;

  const adminLogin = req.session.user || null;
  if (adminLogin === null) {
    res.redirect("/logout");
  }

  try {
    const egzemplarzQuery = `
    SELECT e.egzemplarz_id, b.biblioteka_id
    FROM project.wypozyczenie w
    JOIN project.egzemplarz e ON w.egzemplarz_id = e.egzemplarz_id
    JOIN project.biblioteka b ON e.biblioteka_id = b.biblioteka_id
    WHERE w.wypozyczenie_id = $1
  `;
    const egzemplarzResult = await pool.query(egzemplarzQuery, [
      wypozyczenie_id,
    ]);
    if (egzemplarzResult.rowCount === 0) {
      return res.status(404).json({ error: "Nie znaleziono wypożyczenia." });
    }

    const { egzemplarz_id, biblioteka_id } = egzemplarzResult.rows[0];

    const adminQuery = `
    SELECT 1
    FROM project.administrator a
    JOIN project.zarzadzanie z ON a.administrator_id = z.administrator_id
    WHERE a.login = $1 AND z.biblioteka_id = $2
  `;
    const adminResult = await pool.query(adminQuery, [
      adminLogin.login,
      biblioteka_id,
    ]);

    if (adminResult.rowCount === 0) {
      const wypozyczeniaQuery = `
      SELECT * FROM project.widok_wypozyczen 
      WHERE numer_karty_bibliotecznej = $1
      `;

      const wypozyczeniaResult = await pool.query(wypozyczeniaQuery, [
        numer_karty_bibliotecznej,
      ]);

      for (let i = 0; i < wypozyczeniaResult.rows.length; i++) {
        const row = wypozyczeniaResult.rows[i];
        row.start = row.start ? formatujDate(row.start) : null;
        row.koniec = row.koniec ? formatujDate(row.koniec) : null;
        row.zwrot = row.zwrot ? formatujDate(row.zwrot) : null;
      }

      return res.render("wypozyczenia", {
        title: "Twoje wypożyczenia",
        cssFile: "wypozyczenia.css",
        wypozyczenia: wypozyczeniaResult.rows,
        adminLogin,
        toast: {
          title: "Error",
          body: `Zalogowany administrator nie ma dostępu do danej biblioteki`,
        },
      });
    }

    const updateEgzemplarzQuery = `
    UPDATE project.egzemplarz
    SET stan = 'zwrocono'
    WHERE egzemplarz_id = $1
  `;
    await pool.query(updateEgzemplarzQuery, [egzemplarz_id]);

    const updateWypozyczenieQuery = `
  UPDATE project.wypozyczenie
  SET zwrot = CURRENT_DATE
  WHERE wypozyczenie_id = $1
`;
    await pool.query(updateWypozyczenieQuery, [wypozyczenie_id]);

    aktualizujWidokKsiazki();
    aktualizujWidokWypozyczenia();

    const wypozyczeniaQuery2 = `
      SELECT * FROM project.widok_wypozyczen 
      WHERE numer_karty_bibliotecznej = $1
      `;

    const wypozyczeniaResult2 = await pool.query(wypozyczeniaQuery2, [
      numer_karty_bibliotecznej,
    ]);

    for (let i = 0; i < wypozyczeniaResult2.rows.length; i++) {
      const row = wypozyczeniaResult2.rows[i];
      row.start = row.start ? formatujDate(row.start) : null;
      row.koniec = row.koniec ? formatujDate(row.koniec) : null;
      row.zwrot = row.zwrot ? formatujDate(row.zwrot) : null;
    }

    res.render("wypozyczenia", {
      title: "Twoje wypożyczenia",
      cssFile: "wypozyczenia.css",
      adminLogin,
      wypozyczenia: wypozyczeniaResult2.rows,
      toast: {
        title: "Sukces",
        body: `Poprawnie zwrócono książkę`,
      },
    });
  } catch (err) {
    res.render("wypozyczenia", {
      title: "Twoje wypożyczenia",
      cssFile: "wypozyczenia.css",
      wypozyczenia: [],
      adminLogin,
      toast: {
        title: "Error",
        body: `Wystąpił błąd podczas próby zwrócenia książki ${err.message}`,
      },
    });
  }
});

module.exports = router;
