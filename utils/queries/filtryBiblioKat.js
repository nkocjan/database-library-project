const pool = require("../../db");

async function getBibliotekiAndKategorie() {
  try {
    const bibliotekiResult = await pool.query(
      "SELECT * FROM project.biblioteka"
    );
    const kategorieResult = await pool.query("SELECT * FROM project.kategoria");

    const kategorie = kategorieResult.rows;
    const biblioteki = bibliotekiResult.rows;

    return { kategorie, biblioteki };
  } catch (err) {
    console.log("KRYTYCZNY ERROR", err);
    return { kategorie: [], biblioteki: [] };
  }
}

module.exports = getBibliotekiAndKategorie;
