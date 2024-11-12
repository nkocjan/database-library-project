const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Błąd połączenia z bazą danych", err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {

    release();

    if (err) {
      return console.error("Błąd wykonania zapytania", err.stack);
    }

  });
});

module.exports = pool;
