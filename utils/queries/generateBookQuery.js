function generateBookQuery(filters) {
  let query = "SELECT * FROM project.widok_ksiazki";
  let params = [];
  let conditions = [];

  if (filters.filtr_tytul) {
    conditions.push(`tytul LIKE $${params.length + 1}`);
    params.push(`%${filters.filtr_tytul}%`);
  }

  if (filters.filtr_autor) {
    conditions.push(`autor LIKE $${params.length + 1}`);
    params.push(`%${filters.filtr_autor}%`);
  }

  if (filters.kategorie) {
    const kategorieArray = Array.isArray(filters.kategorie)
      ? filters.kategorie
      : [filters.kategorie];

    const categoryPlaceholders = kategorieArray
      .map((_, i) => `$${params.length + i + 1}`)
      .join(", ");
    conditions.push(`kategoria IN (${categoryPlaceholders})`);
    params = params.concat(kategorieArray);
  }

  if (filters.biblioteki) {
    const bibliotekiArray = Array.isArray(filters.biblioteki)
      ? filters.biblioteki
      : [filters.biblioteki];
    const libraryPlaceholders = bibliotekiArray
      .map((_, i) => `$${params.length + i + 1}`)
      .join(", ");
    conditions.push(`biblioteka IN (${libraryPlaceholders})`);
    params = params.concat(bibliotekiArray);
  }

  if (filters.dostepne === "tak") {
    conditions.push("dostepne > 0");
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY ${filters.sortowanie}`;

  return { query, params };
}

module.exports = generateBookQuery;
