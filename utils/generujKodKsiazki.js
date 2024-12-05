const pool = require("../db");

async function generateUniqueCode() {
  let kod;
  do {
    kod = Math.floor(1000 + Math.random() * 90000);
    const checkCodeQuery = "SELECT kod FROM project.ksiazka WHERE kod = $1";
    const checkCodeResult = await pool.query(checkCodeQuery, [kod]);
    if (checkCodeResult.rowCount === 0) break;
  } while (true);
  return kod;
}

module.exports = generateUniqueCode;
