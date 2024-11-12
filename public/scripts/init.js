const pool = require('../../db'); 

async function initializeDataBase() {
  const client = await pool.connect();

  let isOk = true;

  try {
    await client.query('BEGIN');

    const result = await client.query('SELECT wykladowca.nazwisko, wykladowca.wynagrodzenie FROM lab05.wykladowca where wykladowca.wynagrodzenie > 5000');
    console.log("Wyniki zapytania testowego:", result.rows);
    
    await client.query('SET search_path TO project');
    console.log("Search path ustawiony na project");

    await client.query('SET DATESTYLE TO EUROPEAN');
    console.log("Datestyle ustawiony na EUROPEAN");

    await client.query('DROP TABLE IF EXISTS autor CASCADE');
    await client.query('DROP TABLE IF EXISTS kategoria CASCADE');
    await client.query('DROP TABLE IF EXISTS ksiazka CASCADE');
    await client.query('DROP TABLE IF EXISTS ksiazka_autor CASCADE');
    await client.query('DROP TABLE IF EXISTS biblioteka CASCADE');
    await client.query('DROP TABLE IF EXISTS magazyn CASCADE');
    await client.query('DROP TABLE IF EXISTS uzytkownik CASCADE');
    await client.query('DROP TABLE IF EXISTS wypozyczenie CASCADE');
    await client.query('DROP TABLE IF EXISTS administrator CASCADE');
    await client.query('DROP TABLE IF EXISTS zarzadzanie CASCADE');
    console.log("Usunieto tablice w celu resetu");

    await client.query('CREATE TABLE autor (autor_id SERIAL PRIMARY KEY,imie VARCHAR NOT NULL,nazwisko VARCHAR NOT NULL,narodowosc VARCHAR NOT NULL)');
    console.log('Utworzono tabele autor');

    await client.query('CREATE TABLE kategoria (kategoria_id SERIAL PRIMARY KEY,nazwa VARCHAR NOT NULL)');
    console.log('Utworzone tabelę kategoria');

    await client.query('CREATE TABLE ksiazka (ksiazka_id SERIAL PRIMARY KEY,kategoria_id INTEGER REFERENCES kategoria(kategoria_id),tytul VARCHAR NOT NULL,rok_wydania VARCHAR NOT NULL,kod INTEGER NOT NULL)');
    console.log('Utworzone tabelę ksiazka');

    await client.query('CREATE TABLE ksiazka_autor (ksiazka_id INTEGER NOT NULL REFERENCES ksiazka(ksiazka_id) ON DELETE CASCADE,autor_id INTEGER NOT NULL REFERENCES autor(autor_id) ON DELETE CASCADE,PRIMARY KEY (ksiazka_id, autor_id))')
    console.log('Utworzono tabelę ksiazka_autor');

    await client.query('CREATE TABLE biblioteka (biblioteka_id SERIAL PRIMARY KEY,miejscowosc VARCHAR NOT NULL)')
    console.log('Utworzono tabelę biblioteka');

    await client.query('CREATE TABLE magazyn (ksiazka_id INTEGER NOT NULL REFERENCES ksiazka(ksiazka_id) ON DELETE CASCADE, biblioteka_id INTEGER NOT NULL REFERENCES biblioteka(biblioteka_id) ON DELETE CASCADE, ilosc_wszystkich INTEGER NOT NULL, ilosc_dostepnych INTEGER NOT NULL, PRIMARY KEY (ksiazka_id, biblioteka_id))');
    console.log('Utworzono tabelę magazyn');

    await client.query('CREATE TABLE uzytkownik (uzytkownik_id SERIAL PRIMARY KEY, imie VARCHAR NOT NULL, nazwisko VARCHAR NOT NULL, nr_karty_bibliotecznej VARCHAR NOT NULL, data_urodzenia DATE NOT NULL)');
    console.log('Utworzono tabelę uzytkownik');

    await client.query('CREATE TABLE wypozyczenie (wypozyczenie_id SERIAL PRIMARY KEY, ksiazka_id INTEGER NOT NULL REFERENCES ksiazka(ksiazka_id) ON DELETE CASCADE, uzytkownik_id INTEGER NOT NULL REFERENCES uzytkownik(uzytkownik_id) ON DELETE CASCADE, start DATE NOT NULL, koniec DATE NOT NULL, zwrot DATE)');
    console.log('Utworzono tabelę wypozyczenie');

    await client.query('CREATE TABLE administrator (administrator_id SERIAL PRIMARY KEY, login VARCHAR NOT NULL, haslo VARCHAR NOT NULL, email VARCHAR, telefon INTEGER NOT NULL)');
    console.log('Utworzono tabelę administrator');

    await client.query('CREATE TABLE zarzadzanie (biblioteka_id INTEGER NOT NULL REFERENCES biblioteka(biblioteka_id) ON DELETE CASCADE, administrator_id INTEGER NOT NULL REFERENCES administrator(administrator_id) ON DELETE CASCADE, PRIMARY KEY (biblioteka_id, administrator_id))');
    console.log('Utworzono tabelę zarzadzanie');

    await client.query(`INSERT INTO kategoria (nazwa) VALUES ('Fantasy'),('Science Fiction'),('Horror'),('Romans'),('Kryminał'),('Thriller'),('Literatura faktu'),('Biografia'),('Przygodowa'),('Dla dzieci')`);
    console.log('Dodano kategorie');

    await client.query(`INSERT INTO autor (imie, nazwisko, narodowosc) VALUES ('George', 'Orwell', 'Wielka Brytania'), ('Jane', 'Austen', 'Wielka Brytania'), ('J.K.', 'Rowling', 'Wielka Brytania'), ('Agatha', 'Christie', 'Wielka Brytania'), ('Mark', 'Twain', 'USA'), ('F. Scott', 'Fitzgerald', 'USA'), ('Ernest', 'Hemingway', 'USA'), ('Leo', 'Tolstoy', 'Rosja'), ('Fyodor', 'Dostoevsky', 'Rosja'), ('Gabriel', 'Garcia Marquez', 'Kolumbia'), ('Haruki', 'Murakami', 'Japonia'), ('J.R.R.', 'Tolkien', 'Wielka Brytania'), ('Charles', 'Dickens', 'Wielka Brytania'), ('Oscar', 'Wilde', 'Irlandia'), ('Victor', 'Hugo', 'Francja'), ('Jules', 'Verne', 'Francja'), ('Arthur', 'Conan Doyle', 'Wielka Brytania'), ('William', 'Shakespeare', 'Wielka Brytania'), ('Franz', 'Kafka', 'Austria'), ('Herman', 'Melville', 'USA'), ('H.P.', 'Lovecraft', 'USA'), ('Isaac', 'Asimov', 'USA'), ('Stephen', 'King', 'USA'), ('Mary', 'Shelley', 'Wielka Brytania'), ('Virginia', 'Woolf', 'Wielka Brytania'), ('Jack', 'London', 'USA'), ('Antoine', 'de Saint-Exupéry', 'Francja'), ('Albert', 'Camus', 'Francja'), ('Marcel', 'Proust', 'Francja'), ('Erich', 'Maria Remarque', 'Niemcy')`); 
    console.log('Dodano autorów');

    await client.query(`INSERT INTO ksiazka (kategoria_id, tytul, rok_wydania, kod) VALUES(1, 'Rok 1984', '1949', 1001),(2, 'Folwark zwierzęcy', '1945', 1002),(3, 'Eseje', '1968', 1003),(4, 'Duma i uprzedzenie', '1813', 2001),(5, 'Rozważna i romantyczna', '1811', 2002),(6, 'Emma', '1815', 2003),(1, 'Harry Potter i Kamień Filozoficzny', '1997', 3001),(1, 'Harry Potter i Komnata Tajemnic', '1998', 3002),(1, 'Harry Potter i więzień Azkabanu', '1999', 3003),(5, 'Morderstwo w Orient Expressie', '1934', 4001),(5, 'Śmierć na Nilu', '1937', 4002),(5, 'I nie było już nikogo', '1939', 4003),(2, 'Przygody Tomka Sawyera', '1876', 5001),(2, 'Przygody Hucka Finna', '1884', 5002),(9, 'Książę i żebrak', '1881', 5003),(6, 'Wielki Gatsby', '1925', 6001),(7, 'Piękni i przeklęci', '1922', 6002),(7, 'Czuła jest noc', '1934', 6003),(6, 'Stary człowiek i morze', '1952', 7001),(5, 'Komu bije dzwon', '1940', 7002),(5, 'Pożegnanie z bronią', '1929', 7003),(9, 'Wojna i pokój', '1869', 8001),(9, 'Anna Karenina', '1877', 8002),(10, 'Zmartwychwstanie', '1899', 8003),(10, 'Zbrodnia i kara', '1866', 9001),(10, 'Bracia Karamazow', '1880', 9002),(10, 'Idiota', '1869', 9003),(8, 'Sto lat samotności', '1967', 10001),(8, 'Jesień patriarchy', '1975', 10002),(8, 'Kronika zapowiedzianej śmierci', '1981', 10003),(4, 'Norwegian Wood', '1987', 11001),(4, 'Kafka nad morzem', '2002', 11002),(4, '1Q84', '2009', 11003),(1, 'Władca Pierścieni: Drużyna Pierścienia', '1954', 12001),(1, 'Władca Pierścieni: Dwie Wieże', '1954', 12002),(1, 'Władca Pierścieni: Powrót Króla', '1955', 12003),(5, 'Opowieść o dwóch miastach', '1859', 13001),(5, 'David Copperfield', '1850', 13002),(5, 'Oliver Twist', '1837', 13003),(8, 'Portret Doriana Graya', '1890', 14001),(7, 'Książę i żebrak', '1881', 14002),(7, 'Opowiadania', '1891', 14003),(9, 'Nędznicy', '1862', 15001),(9, 'Człowiek śmiechu', '1869', 15002),(9, 'Katedra Marii Panny w Paryżu', '1831', 15003),(4, 'W 80 dni dookoła świata', '1872', 16001),(4, 'Podróż do wnętrza Ziemi', '1864', 16002),(4, 'Dzieci kapitana Granta', '1868', 16003),(5, 'Studium w szkarłacie', '1887', 17001),(5, 'Znak czterech', '1890', 17002),(5, 'Pies Baskervilleów', '1902', 17003),(5, 'Hamlet', '1603', 18001),(5, 'Makbet', '1606', 18002),(5, 'Romeo i Julia', '1597', 18003),(8, 'Proces', '1925', 19001),(8, 'Zamek', '1926', 19002),(8, 'Ameryka', '1927', 19003),(6, 'Moby Dick', '1851', 20001),(10, 'Benito Cereno', '1855', 20002),(10, 'Billy Budd', '1924', 20003),(6, 'Zew Cthulhu', '1928', 21001),(6, 'W górach szaleństwa', '1936', 21002),(6, 'Widmo nad Innsmouth', '1936', 21003),(2, 'Fundacja', '1951', 22001),(2, 'Roboty', '1950', 22002),(2, 'Koniec wieczności', '1955', 22003),(6, 'Lśnienie', '1977', 23001),(6, 'To', '1986', 23002),(6, 'Miasteczko Salem', '1975', 23003),(9, 'Frankenstein', '1818', 24001),(9, 'Zielony cień', '1820', 24002),(9, 'Matylda', '1819', 24003),(4, 'Pani Dalloway', '1925', 25001),(4, 'Do latarni morskiej', '1927', 25002),(4, 'Fale', '1931', 25003),(8, 'Biały Kieł', '1906', 26001),(8, 'Zew krwi', '1903', 26002),(8, 'Martwe słońce', '1912', 26003),(4, 'Mały Książę', '1943', 27001),(4, 'Listy do matki', '1943', 27002),(4, 'Ziemia, planeta ludzi', '1939', 27003),(9, 'Dżuma', '1947', 28001),(9, 'Obcy', '1942', 28002),(9, 'Upadek', '1956', 28003),(7, 'W poszukiwaniu straconego czasu', '1913', 29001),(7, 'W cieniu zakwitających dziewcząt', '1919', 29002),(7, 'Czas odnaleziony', '1927', 29003),(5, 'Na zachodzie bez zmian', '1929', 30001),(5, 'Czarny obelisk', '1956', 30002),(5, 'Łuk triumfalny', '1945', 30003)`);
    console.log('Dodano książki do bazy danych');

    await client.query(`INSERT INTO ksiazka_autor (ksiazka_id, autor_id) VALUES(1, 1), (2, 1), (3, 1),(4, 2), (5, 2), (6, 2),(7, 3), (8, 3), (9, 3),(10, 4), (11, 4), (12, 4),(13, 5), (14, 5), (15, 5),(16, 6), (17, 6), (18, 6),(19, 7), (20, 7), (21, 7),(22, 8), (23, 8), (24, 8),(25, 9), (26, 9), (27, 9),(28, 10), (29, 10), (30, 10),(31, 11), (32, 11), (33, 11),(34, 12), (35, 12), (36, 12),(37, 13), (38, 13), (39, 13),(40, 14), (41, 14), (42, 14),(43, 15), (44, 15), (45, 15),(46, 16), (47, 16), (48, 16),(49, 17), (50, 17), (51, 17),(52, 18), (53, 18), (54, 18),(55, 19), (56, 19), (57, 19),(58, 20), (59, 20), (60, 20),(61, 21), (62, 21), (63, 21),(64, 22), (65, 22), (66, 22),(67, 23), (68, 23), (69, 23),(70, 24), (71, 24), (72, 24),(73, 25), (74, 25), (75, 25),(76, 26), (77, 26), (78, 26),(79, 27), (80, 27), (81, 27),(82, 28), (83, 28), (84, 28),(85, 29), (86, 29), (87, 29),(88, 30), (89, 30), (90, 30)`);
    console.log('Dodano powiązania autor-książka do tabeli ksiazka_autor');
    
    await client.query(`INSERT INTO biblioteka (miejscowosc) VALUES('Kraków'),('Warszawa'),('Poznań'),('Gdańsk'),('Szczecin')`);
    console.log('Dodano biblioteki');

    await client.query(`INSERT INTO magazyn (ksiazka_id, biblioteka_id, ilosc_wszystkich, ilosc_dostepnych) VALUES(1, 1, 10, 10), (1, 2, 7, 7),(2, 1, 3, 3), (2, 3, 5, 5), (2, 4, 4, 4),(3, 2, 12, 12), (3, 5, 8, 8),(4, 1, 6, 6), (4, 3, 11, 11),(5, 2, 9, 9), (5, 4, 7, 7), (5, 5, 5, 5),(6, 3, 4, 4), (6, 1, 13, 13),(7, 4, 10, 10), (7, 5, 15, 15),(8, 1, 8, 8), (8, 2, 12, 12),(9, 3, 7, 7), (9, 4, 9, 9),(10, 5, 6, 6), (10, 1, 10, 10), (10, 2, 5, 5),(11, 3, 15, 15), (11, 4, 4, 4),(12, 5, 9, 9), (12, 1, 7, 7),(13, 2, 13, 13), (13, 3, 6, 6),(14, 4, 11, 11), (14, 5, 5, 5),(15, 1, 10, 10), (15, 2, 8, 8),(16, 3, 6, 6), (16, 4, 7, 7),(17, 5, 5, 5), (17, 1, 9, 9),(18, 2, 3, 3), (18, 3, 14, 14),(19, 4, 11, 11), (19, 5, 10, 10),(20, 1, 15, 15), (20, 2, 6, 6),(21, 3, 8, 8), (21, 4, 10, 10),(22, 5, 12, 12), (22, 1, 4, 4),(23, 2, 9, 9), (23, 3, 11, 11),(24, 4, 13, 13), (24, 5, 7, 7),(25, 1, 5, 5), (25, 2, 14, 14),(26, 3, 10, 10), (26, 4, 8, 8),(27, 5, 6, 6), (27, 1, 7, 7),(28, 2, 15, 15), (28, 3, 3, 3),(29, 4, 12, 12), (29, 5, 9, 9),(30, 1, 8, 8), (30, 2, 10, 10),(31, 1, 10, 10), (31, 2, 7, 7),(32, 3, 6, 6), (32, 4, 8, 8), (32, 5, 9, 9),(33, 1, 13, 13), (33, 2, 12, 12),(34, 3, 5, 5), (34, 4, 7, 7),(35, 5, 15, 15), (35, 1, 11, 11),(36, 2, 8, 8), (36, 3, 9, 9),(37, 4, 14, 14), (37, 5, 10, 10),(38, 1, 5, 5), (38, 2, 8, 8),(39, 3, 12, 12), (39, 4, 6, 6),(40, 5, 10, 10), (40, 1, 15, 15),(41, 2, 11, 11), (41, 3, 9, 9),(42, 4, 7, 7), (42, 5, 13, 13),(43, 1, 4, 4), (43, 2, 6, 6),(44, 3, 10, 10), (44, 4, 5, 5),(45, 5, 12, 12), (45, 1, 8, 8),(46, 2, 14, 14), (46, 3, 15, 15),(47, 4, 9, 9), (47, 5, 7, 7),(48, 1, 10, 10), (48, 2, 12, 12),(49, 3, 5, 5), (49, 4, 11, 11),(50, 5, 13, 13), (50, 1, 6, 6),(51, 2, 8, 8), (51, 3, 14, 14),(52, 4, 15, 15), (52, 5, 10, 10),(53, 1, 7, 7), (53, 2, 12, 12),(54, 3, 6, 6), (54, 4, 8, 8),(55, 5, 5, 5), (55, 1, 11, 11),(56, 2, 15, 15), (56, 3, 14, 14),(57, 4, 10, 10), (57, 5, 9, 9),(58, 1, 7, 7), (58, 2, 5, 5),(59, 3, 13, 13), (59, 4, 12, 12),(60, 5, 10, 10), (60, 1, 6, 6),(61, 2, 8, 8), (61, 3, 9, 9),(62, 4, 7, 7), (62, 5, 14, 14),(63, 1, 11, 11), (63, 2, 15, 15),(64, 3, 13, 13), (64, 4, 10, 10),(65, 5, 8, 8), (65, 1, 12, 12),(66, 2, 9, 9), (66, 3, 14, 14),(67, 4, 15, 15), (67, 5, 10, 10),(68, 1, 13, 13), (68, 2, 8, 8),(69, 3, 11, 11), (69, 4, 9, 9),(70, 5, 7, 7), (70, 1, 12, 12),(71, 2, 5, 5), (71, 3, 10, 10),(72, 4, 6, 6), (72, 5, 14, 14),(73, 1, 8, 8), (73, 2, 7, 7),(74, 3, 15, 15), (74, 4, 13, 13),(75, 5, 11, 11), (75, 1, 12, 12),(76, 2, 9, 9), (76, 3, 14, 14),(77, 4, 10, 10), (77, 5, 8, 8),(78, 1, 5, 5), (78, 2, 13, 13),(79, 3, 6, 6), (79, 4, 12, 12),(80, 5, 11, 11), (80, 1, 9, 9),(81, 2, 7, 7), (81, 3, 15, 15),(82, 4, 10, 10), (82, 5, 8, 8),(83, 1, 14, 14), (83, 2, 9, 9),(84, 3, 13, 13), (84, 4, 5, 5),(85, 5, 11, 11), (85, 1, 10, 10),(86, 2, 7, 7), (86, 3, 15, 15),(87, 4, 9, 9), (87, 5, 12, 12),(88, 1, 10, 10), (88, 2, 14, 14),(89, 3, 11, 11), (89, 4, 13, 13),(90, 5, 6, 6), (90, 1, 8, 8)`);
    console.log('Dodane dane do tablicy magazyn');

    await client.query(`INSERT INTO administrator (login, haslo,email,telefon) VALUES ('admin', 'admin', 'admin@admin.admin', 123123123)`)
    console.log('Dodane administratora');

    await client.query(`INSERT INTO zarzadzanie (biblioteka_id, administrator_id) VALUES (1, 1), (2,1), (3,1), (4,1), (5,1)`)
    console.log('Przypisano administratora do bibliotek');

    await client.query('COMMIT');
  }catch(err) {
    await client.query('ROLLBACK');
    console.error("Błąd podczas wykonywania zapytań w transakcji:", err.stack);
    isOk = false;
  }finally {
    client.release();
  }

  return isOk;
}

module.exports = initializeDataBase;