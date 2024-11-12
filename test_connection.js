const pool = require('./db'); 

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    return console.error("Błąd połączenia lub zapytania:", err.stack);
  }
  console.log("Połączono z bazą danych PostgreSQL:", result.rows[0]);
  pool.end();
});