const pool = require("../../db");

async function initializeDataBase() {
  const client = await pool.connect();

  let isOk = true;

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "SELECT wykladowca.nazwisko, wykladowca.wynagrodzenie FROM lab05.wykladowca where wykladowca.wynagrodzenie > 5000"
    );
    console.log("Wyniki zapytania testowego:", result.rows);

    await client.query("SET search_path TO project");
    console.log("Search path ustawiony na project");

    await client.query("SET DATESTYLE TO EUROPEAN");
    console.log("Datestyle ustawiony na EUROPEAN");

    await client.query(`
      DROP TABLE IF EXISTS wypozyczenie CASCADE;
      DROP TABLE IF EXISTS egzemplarz CASCADE;
      DROP TABLE IF EXISTS ksiazka_autor CASCADE;
      DROP TABLE IF EXISTS ksiazka CASCADE;
      DROP TABLE IF EXISTS kategoria CASCADE;
      DROP TABLE IF EXISTS autor CASCADE;
      DROP TABLE IF EXISTS biblioteka CASCADE;
      DROP TABLE IF EXISTS uzytkownik CASCADE;
      DROP TABLE IF EXISTS administrator CASCADE;
      DROP TABLE IF EXISTS zarzadzanie CASCADE;
    `);
    console.log("Usunięto wszystkie tabele");

    // Tworzenie tabel
    await client.query(`
  CREATE TABLE autor (
    autor_id SERIAL PRIMARY KEY,
    imie VARCHAR(20) NOT NULL,
    nazwisko VARCHAR(25) NOT NULL,
    narodowosc VARCHAR(30) NOT NULL
  );
`);
    console.log("Utworzono tabelę autor");

    await client.query(`
  CREATE TABLE kategoria (
    kategoria_id SERIAL PRIMARY KEY,
    nazwa VARCHAR(25) NOT NULL
  );
`);
    console.log("Utworzono tabelę kategoria");

    await client.query(`
  CREATE TABLE ksiazka (
    ksiazka_id SERIAL PRIMARY KEY,
    kategoria_id INTEGER REFERENCES kategoria(kategoria_id) ON DELETE SET NULL,
    tytul VARCHAR NOT NULL,
    rok_wydania VARCHAR NOT NULL,
    kod INTEGER CHECK (kod >= 0 AND kod <= 1000000) NOT NULL
  );
`);
    console.log("Utworzono tabelę ksiazka");

    await client.query(`
  CREATE TABLE ksiazka_autor (
    ksiazka_id INTEGER NOT NULL REFERENCES ksiazka(ksiazka_id) ON DELETE CASCADE,
    autor_id INTEGER NOT NULL REFERENCES autor(autor_id) ON DELETE CASCADE,
    PRIMARY KEY (ksiazka_id, autor_id)
  );
`);
    console.log("Utworzono tabelę ksiazka_autor");

    await client.query(`
  CREATE TABLE biblioteka (
    biblioteka_id SERIAL PRIMARY KEY,
    miejscowosc VARCHAR(30) NOT NULL
  );
`);
    console.log("Utworzono tabelę biblioteka");

    await client.query(`
  CREATE TABLE egzemplarz (
    egzemplarz_id SERIAL PRIMARY KEY,
    ksiazka_id INTEGER NOT NULL REFERENCES ksiazka(ksiazka_id) ON DELETE CASCADE,
    biblioteka_id INTEGER NOT NULL REFERENCES biblioteka(biblioteka_id) ON DELETE CASCADE,
    stan VARCHAR NOT NULL CHECK (stan IN ('Nowy', 'Wypozyczony', 'zwrocono')),
    data_nabycia DATE NOT NULL CHECK (data_nabycia >= '2021-01-01' AND data_nabycia < CURRENT_DATE + INTERVAL '1 day')  );
`);
    console.log("Utworzono tabelę egzemplarz");

    await client.query(`
CREATE TABLE uzytkownik (
    uzytkownik_id SERIAL PRIMARY KEY,
    imie VARCHAR(20) NOT NULL,
    nazwisko VARCHAR(25) NOT NULL,
    nr_karty_bibliotecznej VARCHAR(10) NOT NULL,
    data_urodzenia DATE NOT NULL CHECK (data_urodzenia >= '1910-01-01' AND data_urodzenia < '2017-01-01')
);
`);
    console.log("Utworzono tabelę uzytkownik");

    await client.query(`
CREATE TABLE wypozyczenie (
    wypozyczenie_id SERIAL PRIMARY KEY,
    egzemplarz_id INTEGER NOT NULL REFERENCES egzemplarz(egzemplarz_id) ON DELETE CASCADE,
    uzytkownik_id INTEGER NOT NULL REFERENCES uzytkownik(uzytkownik_id) ON DELETE CASCADE,
    start DATE NOT NULL CHECK (start >= '2021-01-01'),
    koniec DATE NOT NULL CHECK (koniec > start),
    zwrot DATE CHECK (zwrot >= start AND zwrot <= CURRENT_DATE));
`);
    console.log("Utworzono tabelę wypozyczenie");

    await client.query(`
  CREATE TABLE administrator (
    administrator_id SERIAL PRIMARY KEY,
    login VARCHAR(15) NOT NULL,
    haslo VARCHAR(25) NOT NULL,
    email VARCHAR(25),
    telefon INTEGER NOT NULL
  );
`);
    console.log("Utworzono tabelę administrator");

    await client.query(`
  CREATE TABLE zarzadzanie (
    biblioteka_id INTEGER NOT NULL REFERENCES biblioteka(biblioteka_id) ON DELETE CASCADE,
    administrator_id INTEGER NOT NULL REFERENCES administrator(administrator_id) ON DELETE CASCADE,
    PRIMARY KEY (biblioteka_id, administrator_id)
  );
`);
    console.log("Utworzono tabelę zarzadzanie");

    await client.query(
      `INSERT INTO kategoria (nazwa) VALUES ('Fantasy'),('Science Fiction'),('Horror'),('Romans'),('Kryminał'),('Thriller'),('Literatura faktu'),('Biografia'),('Przygodowa'),('Dla dzieci')`
    );
    console.log("Dodano kategorie");

    await client.query(
      `INSERT INTO autor (imie, nazwisko, narodowosc) VALUES ('George', 'Orwell', 'Wielka Brytania'), ('Jane', 'Austen', 'Wielka Brytania'), ('J.K.', 'Rowling', 'Wielka Brytania'), ('Agatha', 'Christie', 'Wielka Brytania'), ('Mark', 'Twain', 'USA'), ('F. Scott', 'Fitzgerald', 'USA'), ('Ernest', 'Hemingway', 'USA'), ('Leo', 'Tolstoy', 'Rosja'), ('Fyodor', 'Dostoevsky', 'Rosja'), ('Gabriel', 'Garcia Marquez', 'Kolumbia'), ('Haruki', 'Murakami', 'Japonia'), ('J.R.R.', 'Tolkien', 'Wielka Brytania'), ('Charles', 'Dickens', 'Wielka Brytania'), ('Oscar', 'Wilde', 'Irlandia'), ('Victor', 'Hugo', 'Francja'), ('Jules', 'Verne', 'Francja'), ('Arthur', 'Conan Doyle', 'Wielka Brytania'), ('William', 'Shakespeare', 'Wielka Brytania'), ('Franz', 'Kafka', 'Austria'), ('Herman', 'Melville', 'USA'), ('H.P.', 'Lovecraft', 'USA'), ('Isaac', 'Asimov', 'USA'), ('Stephen', 'King', 'USA'), ('Mary', 'Shelley', 'Wielka Brytania'), ('Virginia', 'Woolf', 'Wielka Brytania'), ('Jack', 'London', 'USA'), ('Antoine', 'de Saint-Exupéry', 'Francja'), ('Albert', 'Camus', 'Francja'), ('Marcel', 'Proust', 'Francja'), ('Erich', 'Maria Remarque', 'Niemcy'),('Adam', 'Mickiewicz', 'Polska'), ('Henryk', 'Sienkiewicz', 'Polska'), ('Bolesław', 'Prus', 'Polska'), ('Juliusz', 'Słowacki', 'Polska'), ('Stanisław', 'Lem', 'Polska')`
    );
    console.log("Dodano autorów");

    await client.query(
      `INSERT INTO ksiazka (kategoria_id, tytul, rok_wydania, kod) VALUES(1, 'Rok 1984', '1949', 1001),(2, 'Folwark zwierzęcy', '1945', 1002),(3, 'Eseje', '1968', 1003),(4, 'Duma i uprzedzenie', '1813', 2001),(5, 'Rozważna i romantyczna', '1811', 2002),(6, 'Emma', '1815', 2003),(1, 'Harry Potter i Kamień Filozoficzny', '1997', 3001),(1, 'Harry Potter i Komnata Tajemnic', '1998', 3002),(1, 'Harry Potter i więzień Azkabanu', '1999', 3003),(5, 'Morderstwo w Orient Expressie', '1934', 4001),(5, 'Śmierć na Nilu', '1937', 4002),(5, 'I nie było już nikogo', '1939', 4003),(2, 'Przygody Tomka Sawyera', '1876', 5001),(2, 'Przygody Hucka Finna', '1884', 5002),(9, 'Książę i żebrak', '1881', 5003),(6, 'Wielki Gatsby', '1925', 6001),(7, 'Piękni i przeklęci', '1922', 6002),(7, 'Czuła jest noc', '1934', 6003),(6, 'Stary człowiek i morze', '1952', 7001),(5, 'Komu bije dzwon', '1940', 7002),(5, 'Pożegnanie z bronią', '1929', 7003),(9, 'Wojna i pokój', '1869', 8001),(9, 'Anna Karenina', '1877', 8002),(10, 'Zmartwychwstanie', '1899', 8003),(10, 'Zbrodnia i kara', '1866', 9001),(10, 'Bracia Karamazow', '1880', 9002),(10, 'Idiota', '1869', 9003),(8, 'Sto lat samotności', '1967', 10001),(8, 'Jesień patriarchy', '1975', 10002),(8, 'Kronika zapowiedzianej śmierci', '1981', 10003),(4, 'Norwegian Wood', '1987', 11001),(4, 'Kafka nad morzem', '2002', 11002),(4, '1Q84', '2009', 11003),(1, 'Władca Pierścieni: Drużyna Pierścienia', '1954', 12001),(1, 'Władca Pierścieni: Dwie Wieże', '1954', 12002),(1, 'Władca Pierścieni: Powrót Króla', '1955', 12003),(5, 'Opowieść o dwóch miastach', '1859', 13001),(5, 'David Copperfield', '1850', 13002),(5, 'Oliver Twist', '1837', 13003),(8, 'Portret Doriana Graya', '1890', 14001),(7, 'Książę i żebrak', '1881', 14002),(7, 'Opowiadania', '1891', 14003),(9, 'Nędznicy', '1862', 15001),(9, 'Człowiek śmiechu', '1869', 15002),(9, 'Katedra Marii Panny w Paryżu', '1831', 15003),(4, 'W 80 dni dookoła świata', '1872', 16001),(4, 'Podróż do wnętrza Ziemi', '1864', 16002),(4, 'Dzieci kapitana Granta', '1868', 16003),(5, 'Studium w szkarłacie', '1887', 17001),(5, 'Znak czterech', '1890', 17002),(5, 'Pies Baskervilleów', '1902', 17003),(5, 'Hamlet', '1603', 18001),(5, 'Makbet', '1606', 18002),(5, 'Romeo i Julia', '1597', 18003),(8, 'Proces', '1925', 19001),(8, 'Zamek', '1926', 19002),(8, 'Ameryka', '1927', 19003),(6, 'Moby Dick', '1851', 20001),(10, 'Benito Cereno', '1855', 20002),(10, 'Billy Budd', '1924', 20003),(6, 'Zew Cthulhu', '1928', 21001),(6, 'W górach szaleństwa', '1936', 21002),(6, 'Widmo nad Innsmouth', '1936', 21003),(2, 'Fundacja', '1951', 22001),(2, 'Roboty', '1950', 22002),(2, 'Koniec wieczności', '1955', 22003),(6, 'Lśnienie', '1977', 23001),(6, 'To', '1986', 23002),(6, 'Miasteczko Salem', '1975', 23003),(9, 'Frankenstein', '1818', 24001),(9, 'Zielony cień', '1820', 24002),(9, 'Matylda', '1819', 24003),(4, 'Pani Dalloway', '1925', 25001),(4, 'Do latarni morskiej', '1927', 25002),(4, 'Fale', '1931', 25003),(8, 'Biały Kieł', '1906', 26001),(8, 'Zew krwi', '1903', 26002),(8, 'Martwe słońce', '1912', 26003),(4, 'Mały Książę', '1943', 27001),(4, 'Listy do matki', '1943', 27002),(4, 'Ziemia, planeta ludzi', '1939', 27003),(9, 'Dżuma', '1947', 28001),(9, 'Obcy', '1942', 28002),(9, 'Upadek', '1956', 28003),(7, 'W poszukiwaniu straconego czasu', '1913', 29001),(7, 'W cieniu zakwitających dziewcząt', '1919', 29002),(7, 'Czas odnaleziony', '1927', 29003),(5, 'Na zachodzie bez zmian', '1929', 30001),(5, 'Czarny obelisk', '1956', 30002),(5, 'Łuk triumfalny', '1945', 30003), (1, 'Pan Tadeusz', '1834', 31001), (2, 'Dziady', '1822', 31002), (3, 'Quo Vadis', '1896', 32001), (4, 'Krzyżacy', '1900', 32002),(5, 'Lalka', '1890', 33001), (6, 'Faraon', '1897', 33002), (7, 'Emancypantki', '1894', 33003), (8, 'Placówka', '1886', 33004), (9, 'Kordian', '1834', 34001), (10, 'Balladyna', '1839', 34002), (1, 'Beniowski', '1841', 34003), (2, 'Mazepa', '1839', 34004), (3, 'Solaris', '1961', 35001), (4, 'Cyberiada', '1965', 35002), (5, 'Dzienniki gwiazdowe', '1957', 35003), (6, 'Bajki robotów', '1964', 35004)`
    );
    console.log("Dodano książki do bazy danych");

    await client.query(
      `INSERT INTO ksiazka_autor (ksiazka_id, autor_id) VALUES(1, 1), (2, 1), (3, 1),(4, 2), (5, 2), (6, 2),(7, 3), (8, 3), (9, 3),(10, 4), (11, 4), (12, 4),(13, 5), (14, 5), (15, 5),(16, 6), (17, 6), (18, 6),(19, 7), (20, 7), (21, 7),(22, 8), (23, 8), (24, 8),(25, 9), (26, 9), (27, 9),(28, 10), (29, 10), (30, 10),(31, 11), (32, 11), (33, 11),(34, 12), (35, 12), (36, 12),(37, 13), (38, 13), (39, 13),(40, 14), (41, 14), (42, 14),(43, 15), (44, 15), (45, 15),(46, 16), (47, 16), (48, 16),(49, 17), (50, 17), (51, 17),(52, 18), (53, 18), (54, 18),(55, 19), (56, 19), (57, 19),(58, 20), (59, 20), (60, 20),(61, 21), (62, 21), (63, 21),(64, 22), (65, 22), (66, 22),(67, 23), (68, 23), (69, 23),(70, 24), (71, 24), (72, 24),(73, 25), (74, 25), (75, 25),(76, 26), (77, 26), (78, 26),(79, 27), (80, 27), (81, 27),(82, 28), (83, 28), (84, 28),(85, 29), (86, 29), (87, 29),(88, 30), (89, 30), (90, 30), (91, 31), (92, 31), (93, 32), (94, 32), (95,33), (96,33), (97,33), (98,33), (99, 34), (100,34), (101, 34), (102,34), (103, 35), (104,35), (105,35), (106, 35)`
    );
    console.log("Dodano powiązania autor-książka do tabeli ksiazka_autor");

    await client.query(
      `INSERT INTO biblioteka (miejscowosc) VALUES('Kraków'),('Warszawa'),('Poznań'),('Gdańsk'),('Szczecin')`
    );
    console.log("Dodano biblioteki");

    await client.query(
      `INSERT INTO administrator (login, haslo,email,telefon) VALUES ('admin', 'admin', 'admin@admin.admin', 123123123)`
    );
    console.log("Dodano administratora");

    await client.query(
      `INSERT INTO zarzadzanie (biblioteka_id, administrator_id) VALUES (1, 1), (2,1), (3,1), (4,1), (5,1)`
    );
    console.log("Przypisano administratora do bibliotek");

    await client.query(`INSERT INTO uzytkownik (imie, nazwisko, nr_karty_bibliotecznej, data_urodzenia) VALUES 
      ('Nikodem', 'Kocjan', '08092002', '2002-09-08'), 
      ('Adam', 'Kowalski', '03032001', '2001-03-03'), 
      ('Mieszko', 'Pierwszy', '01012001', '2001-01-01')`);

    await client.query(`
      CREATE OR REPLACE FUNCTION dodaj_egzemplarze(id_ksiazki INTEGER, id_biblioteki INTEGER, ilosc INTEGER) RETURNS VOID AS $$
      DECLARE
          i INTEGER := 1;
      BEGIN
          WHILE i <= ilosc LOOP
              INSERT INTO egzemplarz (ksiazka_id, biblioteka_id, stan, data_nabycia)
              VALUES (id_ksiazki, id_biblioteki, 'Nowy', NOW());
              i := i + 1;
          END LOOP;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log("Funkcja dodaj_egzemplarze została utworzona.");

    for (let i = 1; i <= 106; i++) {
      for (let bib = 0; bib < Math.floor(Math.random() * 4) + 1; bib++) {
        const idBiblioteki = Math.floor(Math.random() * 5) + 1;
        const iloscEgzemplarzy = Math.floor(Math.random() * 8) + 4;
        await client.query("SELECT dodaj_egzemplarze($1, $2, $3);", [
          i,
          idBiblioteki,
          iloscEgzemplarzy,
        ]);
      }
    }
    console.log("Dodano egzemplarze do bibliotek wykorzystując funkcję");

    await client.query(
      `CREATE OR REPLACE VIEW project.widok_ksiazki AS
SELECT
    ks.ksiazka_id AS ksiazka_id,
    ks.tytul AS tytul,
    ks.rok_wydania AS rok_wydania,
    kat.nazwa AS kategoria,
    CONCAT(au.imie, ' ', au.nazwisko) AS autor,
    bib.miejscowosc AS biblioteka,
    ks.kod AS kod,
    COUNT(*) AS ilosc_wszystkich,
    COUNT(CASE WHEN eg.stan = 'Nowy' OR eg.stan = 'zwrocono' THEN 1 ELSE NULL END) AS ilosc_dostepnych
FROM
    project.ksiazka ks
        JOIN
    project.kategoria kat ON ks.kategoria_id = kat.kategoria_id
        JOIN
    project.ksiazka_autor ka ON ks.ksiazka_id = ka.ksiazka_id
        JOIN
    project.autor au ON ka.autor_id = au.autor_id
        JOIN
    project.egzemplarz eg ON ks.ksiazka_id = eg.ksiazka_id
        JOIN
    project.biblioteka bib ON eg.biblioteka_id = bib.biblioteka_id
GROUP BY
    ks.ksiazka_id, ks.tytul, ks.rok_wydania, kat.nazwa, au.imie, au.nazwisko, bib.miejscowosc, ks.kod;`
    );
    console.log("Utworzono widok dla książek");

    await client.query(
      `CREATE VIEW project.widok_wypozyczen AS 
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
`
    );
    console.log("Utworzono widok dla wypożyczeń");

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Błąd podczas wykonywania zapytań w transakcji:", err.stack);
    isOk = false;
  } finally {
    client.release();
  }

  return isOk;
}

module.exports = initializeDataBase;
