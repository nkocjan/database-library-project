const pool = require("../../db");

async function updateWidokWypozyczen() {
  try {
    const query = `
      CREATE OR REPLACE VIEW project.widok_wypozyczen AS 
      SELECT 
          ks.tytul AS tytul, 
          kat.nazwa AS kategoria, 
          CONCAT(au.imie, ' ', au.nazwisko) AS autor, 
          bib.miejscowosc AS biblioteka, 
          ks.kod AS kod, 
          wyp.start AS start, 
          wyp.koniec AS koniec, 
          wyp.zwrot AS zwrot,
          wyp.wypozyczenie_id AS wypozyczenie_id,
          uz.nr_karty_bibliotecznej AS numer_karty_bibliotecznej
      FROM 
          wypozyczenie wyp
      JOIN 
          egzemplarz e ON wyp.egzemplarz_id = e.egzemplarz_id
      JOIN 
          ksiazka ks ON e.ksiazka_id = ks.ksiazka_id
      JOIN 
          kategoria kat ON ks.kategoria_id = kat.kategoria_id
      JOIN 
          ksiazka_autor ka ON ks.ksiazka_id = ka.ksiazka_id
      JOIN 
          autor au ON ka.autor_id = au.autor_id
      JOIN 
          biblioteka bib ON e.biblioteka_id = bib.biblioteka_id
      JOIN 
          uzytkownik uz ON wyp.uzytkownik_id = uz.uzytkownik_id;
    `;

    await pool.query(query);
    console.log("Widok 'widok_wypozyczen' został zaktualizowany.");
  } catch (err) {
    console.error(
      "Błąd podczas aktualizacji widoku 'widok_wypozyczen':",
      err.message
    );
  }
}
module.exports = updateWidokWypozyczen;
