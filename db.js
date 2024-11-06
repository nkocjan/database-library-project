const { Pool } = require("pg");

const pool = new Pool({
  user: "twoja_nazwa_uzytkownika",
  host: "localhost",
  database: "twoja_nazwa_bazy_danych",
  password: "twoje_haslo",
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Błąd połączenia z bazą danych", err.stack);
  }
  console.log("Połączono z bazą danych PostgreSQL");
  release();
});

module.exports = pool;
