const pool = require("../../db");

async function updateWidokKsiazki() {
  try {
    const query = `
      CREATE OR REPLACE VIEW project.widok_ksiazki AS
SELECT
    ks.ksiazka_id AS ksiazka_id,
    ks.tytul AS tytul,
    ks.rok_wydania AS rok_wydania,
    kat.nazwa AS kategoria,
    CONCAT(au.imie, ' ', au.nazwisko) AS autor,
    bib.miejscowosc AS biblioteka,
    ks.kod AS kod,
    COUNT(eg.egzemplarz_id) AS ilosc_wszystkich,
    COUNT(CASE WHEN eg.stan = 'Nowy' OR eg.stan = 'zwrocono' THEN 1 ELSE NULL END) AS ilosc_dostepnych
FROM
    project.ksiazka ks
        JOIN
    project.kategoria kat ON ks.kategoria_id = kat.kategoria_id
        JOIN
    project.ksiazka_autor ka ON ks.ksiazka_id = ka.ksiazka_id
        JOIN
    project.autor au ON ka.autor_id = au.autor_id
        LEFT JOIN
    project.egzemplarz eg ON ks.ksiazka_id = eg.ksiazka_id
        LEFT JOIN
    project.biblioteka bib ON eg.biblioteka_id = bib.biblioteka_id
GROUP BY
    ks.ksiazka_id, ks.tytul, ks.rok_wydania, kat.nazwa, au.imie, au.nazwisko, bib.miejscowosc, ks.kod;
    `;

    await pool.query(query);
    console.log("Widok 'widok_ksiazki' został zaktualizowany.");
  } catch (err) {
    console.error(
      "Błąd podczas aktualizacji widoku 'widok_ksiazki':",
      err.message
    );
  }
}

module.exports = updateWidokKsiazki;
