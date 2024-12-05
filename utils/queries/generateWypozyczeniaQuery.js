function generateWypozyczeniaQuery(filters, numerKarty) {
  let query = "SELECT * FROM project.widok_wypozyczen WHERE numer_karty_bibliotecznej = $1";
  let params = [numerKarty];
  let conditions = [];

  if (filters.filtr_tytul) {
      conditions.push(`tytul ILIKE $${params.length + 1}`);
      params.push(`%${filters.filtr_tytul}%`);
  }

  if (filters.filtr_autor) {
      conditions.push(`autor ILIKE $${params.length + 1}`);
      params.push(`%${filters.filtr_autor}%`);
  }

  if (filters.filtr_kod) {
      conditions.push(`kod ILIKE $${params.length + 1}`);
      params.push(`%${filters.filtr_kod}%`);
  }

  if (filters.kategorie) {
      const kategorieArray = Array.isArray(filters.kategorie) ? filters.kategorie : [filters.kategorie];
      const kategoriePlaceholders = kategorieArray.map((_, i) => `$${params.length + i + 1}`).join(", ");
      conditions.push(`kategoria IN (${kategoriePlaceholders})`);
      params = params.concat(kategorieArray);
  }

  if (filters.biblioteki) {
      const bibliotekiArray = Array.isArray(filters.biblioteki) ? filters.biblioteki : [filters.biblioteki];
      const bibliotekiPlaceholders = bibliotekiArray.map((_, i) => `$${params.length + i + 1}`).join(", ");
      conditions.push(`biblioteka IN (${bibliotekiPlaceholders})`);
      params = params.concat(bibliotekiArray);
  }

  if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
  }

  const sortowanieOptions = ["tytul", "autor", "kategoria", "biblioteka", "kod", "data_wypozyczenia", "data_zwrotu", "data_oddania"];
  if (filters.sortowanie && sortowanieOptions.includes(filters.sortowanie)) {
      query += ` ORDER BY ${filters.sortowanie}`;
  } else {
      query += " ORDER BY data_wypozyczenia"; 
  }

  return { query, params };
}
