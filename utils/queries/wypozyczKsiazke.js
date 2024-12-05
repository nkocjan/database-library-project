const pool = require("../../db");

const wypozyczKsiazke = async (
  imie,
  nazwisko,
  nr_karty_bibliotecznej,
  kod_ksiazki,
  id_biblioteki
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("SET search_path TO project");

    const userQuery = `
      SELECT uzytkownik_id 
      FROM project.uzytkownik 
      WHERE imie = $1 AND nazwisko = $2 AND nr_karty_bibliotecznej = $3;
    `;
    const userResult = await client.query(userQuery, [
      imie,
      nazwisko,
      nr_karty_bibliotecznej,
    ]);

    if (userResult.rowCount === 0) {
      return {
        title: "Error",
        body: "Użytkownik nie istnieje",
      };
    }
    const uzytkownik_id = userResult.rows[0].uzytkownik_id;

    const bookQuery = `
      SELECT ksiazka_id 
      FROM ksiazka 
      WHERE kod = $1;
    `;
    const bookResult = await client.query(bookQuery, [kod_ksiazki]);
    if (bookResult.rowCount === 0) {
      return {
        title: "Error",
        body: "Książka nie istnieje",
      };
    }
    const ksiazka_id = bookResult.rows[0].ksiazka_id;

    const egzemplarzQuery = `
SELECT egzemplarz_id 
FROM egzemplarz 
WHERE ksiazka_id = $1 
  AND biblioteka_id = $2 
  AND stan IN ('Nowy', 'zwrocono') 
LIMIT 1;
    `;
    const egzemplarzResult = await client.query(egzemplarzQuery, [
      ksiazka_id,
      id_biblioteki,
    ]);
    if (egzemplarzResult.rowCount === 0) {
      return {
        title: "Error",
        body: "Brak dostępnych egzemplarzy w tej bibliotece",
      };
    }
    const egzemplarz_id = egzemplarzResult.rows[0].egzemplarz_id;

    const wypozyczenieQuery = `
      INSERT INTO wypozyczenie (egzemplarz_id, uzytkownik_id, start, koniec) 
      VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days') 
      RETURNING wypozyczenie_id;
    `;
    const wypozyczenieResult = await client.query(wypozyczenieQuery, [
      egzemplarz_id,
      uzytkownik_id,
    ]);
    const wypozyczenie_id = wypozyczenieResult.rows[0].wypozyczenie_id;

    const updateEgzemplarzQuery = `
      UPDATE egzemplarz 
      SET stan = 'Wypozyczony' 
      WHERE egzemplarz_id = $1;
    `;
    await client.query(updateEgzemplarzQuery, [egzemplarz_id]);

    await client.query("COMMIT");
    return {
      title: "Sukces",
      body: `Wypożyczenie zakończone sukcesem. ID wypożyczenia: ${wypozyczenie_id}`,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    return {
      title: "Error",
      body: `Błąd podczas wypożyczania książki:, ${err.message}`,
    };
  } finally {
    client.release();
  }
};

module.exports = wypozyczKsiazke;
