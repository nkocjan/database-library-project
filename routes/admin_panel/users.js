const express = require("express");
const router = express.Router();
const requireAuth = require("../../public/scripts/requireAuth");
const pool = require("../../db");
const formatujDate = require("../../utils/formatujDate");

router.get("/", requireAuth, async (req, res) => {
  try {
    const uzytkownicyResult = await pool.query(
      "SELECT * FROM project.uzytkownik"
    );
    const uzytkownicy = uzytkownicyResult.rows;

    for (let i = 0; i < uzytkownicy.length; i++) {
      const row = uzytkownicy[i];
      row.data_urodzenia = row.data_urodzenia
        ? formatujDate(row.data_urodzenia)
        : null;
    }

    res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy,
    });
  } catch (err) {
    res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy: [],
      toast: {
        title: "Error",
        body: `Błąd. Skontaktuj się z administratorem ${err.message}`,
      },
    });
  }
});

router.post("/edytuj", requireAuth, async (req, res) => {
  const { imie, nazwisko, data_urodzenia, uzytkownik_id } = req.body;
  if (!imie || !nazwisko || !data_urodzenia || !uzytkownik_id) {
    res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy: [],
      toast: {
        title: "Error",
        body: `Błąd. Nie podano danych ${
          imie + nazwisko + data_urodzenia + uzytkownik_id
        }`,
      },
    });
  }

  try {
    const updateQuery = `
      UPDATE project.uzytkownik 
      SET imie = $1, nazwisko = $2, data_urodzenia = $3
      WHERE uzytkownik_id = $4
    `;

    await pool.query(updateQuery, [
      imie,
      nazwisko,
      data_urodzenia,
      uzytkownik_id,
    ]);

    const result = await pool.query(`
      SELECT uzytkownik_id, imie, nazwisko, data_urodzenia, nr_karty_bibliotecznej
      FROM project.uzytkownik
    `);

    let uzytkownicy = result.rows;

    for (let i = 0; i < uzytkownicy.length; i++) {
      const row = uzytkownicy[i];
      row.data_urodzenia = row.data_urodzenia
        ? formatujDate(row.data_urodzenia)
        : null;
    }

    res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy: uzytkownicy,
      toast: {
        title: "Sukces",
        body: "Dane użytkownika zostały pomyślnie zaktualizowane.",
      },
    });
  } catch (err) {
    console.error("Błąd podczas edytowania użytkownika:", err);
    res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy: [],
      toast: {
        title: "Error",
        body: `Wystąpił błąd podczas aktualizacji danych użytkownika ${err.message}`,
      },
    });
  }
});

router.post("/usun", requireAuth, async (req, res) => {
  const { uzytkownik_id } = req.body;

  if (!uzytkownik_id) {
    return res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy: [],
      toast: {
        title: "Error",
        body: "Błąd. Nie podano ID użytkownika do usunięcia.",
      },
    });
  }

  try {
    const deleteQuery = `
      DELETE FROM project.uzytkownik
      WHERE uzytkownik_id = $1
    `;

    await pool.query(deleteQuery, [uzytkownik_id]);

    const result = await pool.query(`
      SELECT uzytkownik_id, imie, nazwisko, data_urodzenia, nr_karty_bibliotecznej
      FROM project.uzytkownik
    `);

    let uzytkownicy = result.rows;

    for (let i = 0; i < uzytkownicy.length; i++) {
      const row = uzytkownicy[i];
      row.data_urodzenia = row.data_urodzenia
        ? formatujDate(row.data_urodzenia)
        : null;
    }

    res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy,
      toast: {
        title: "Sukces",
        body: "Użytkownik został pomyślnie usunięty.",
      },
    });
  } catch (err) {
    console.error("Błąd podczas usuwania użytkownika:", err);
    res.render("admin_views/users", {
      title: "Użytkownicy",
      cssFile: "admin_users.css",
      uzytkownicy: [],
      toast: {
        title: "Error",
        body: "Wystąpił błąd podczas usuwania użytkownika.",
      },
    });
  }
});

module.exports = router;
