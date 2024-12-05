const express = require("express");
const router = express.Router();
const requireAuth = require("../../public/scripts/requireAuth");
const pool = require("../../db");

router.get("/", requireAuth, async (req, res) => {
  try {
    const authorsResult = await pool.query(`
      SELECT 
        a.autor_id,
        a.imie,
        a.nazwisko,
        a.narodowosc,
        COUNT(ka.ksiazka_id) AS liczba_ksiazek
      FROM 
        project.autor a
      LEFT JOIN 
        project.ksiazka_autor ka ON a.autor_id = ka.autor_id
      GROUP BY 
        a.autor_id, a.imie, a.nazwisko, a.narodowosc
      ORDER BY 
        liczba_ksiazek DESC;
    `);
    const authors = authorsResult.rows;

    res.render("admin_views/author", {
      title: "Autorzy",
      cssFile: "admin_author.css",
      autorzy: authors,
    });
  } catch (err) {
    res.render("admin_views/author", {
      title: "Autorzy",
      cssFile: "admin_author.css",
      autorzy: [],
      toast: {
        title: "Error",
        body: `Błąd podczas pobierania listy autorów. ${err.message}`,
      },
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const {
    filtr_autor_imie,
    filtr_autor_nazwisko,
    filtr_autor_narodowosc,
    filtr_autor_min_ksiazek,
    filtr_autor_max_ksiazek,
  } = req.body;

  try {
    let query = `
      SELECT 
        a.autor_id,
        a.imie,
        a.nazwisko,
        a.narodowosc,
        COUNT(ka.ksiazka_id) AS liczba_ksiazek
      FROM 
        project.autor a
      LEFT JOIN 
        project.ksiazka_autor ka ON a.autor_id = ka.autor_id
      WHERE 1=1
    `;

    const params = [];
    if (filtr_autor_imie) {
      query += ` AND a.imie ILIKE $${params.length + 1}`;
      params.push(`%${filtr_autor_imie}%`);
    }
    if (filtr_autor_nazwisko) {
      query += ` AND a.nazwisko ILIKE $${params.length + 1}`;
      params.push(`%${filtr_autor_nazwisko}%`);
    }
    if (filtr_autor_narodowosc) {
      query += ` AND a.narodowosc ILIKE $${params.length + 1}`;
      params.push(`%${filtr_autor_narodowosc}%`);
    }

    query += `
      GROUP BY 
        a.autor_id, a.imie, a.nazwisko, a.narodowosc
    `;

    if (filtr_autor_min_ksiazek || filtr_autor_max_ksiazek) {
      query += ` HAVING 1=1`;
      if (filtr_autor_min_ksiazek) {
        query += ` AND COUNT(ka.ksiazka_id) >= $${params.length + 1}`;
        params.push(filtr_autor_min_ksiazek);
      }
      if (filtr_autor_max_ksiazek) {
        query += ` AND COUNT(ka.ksiazka_id) <= $${params.length + 1}`;
        params.push(filtr_autor_max_ksiazek);
      }
    }

    query += `
      ORDER BY 
        liczba_ksiazek DESC;
    `;

    const authorsResult = await pool.query(query, params);
    const authors = authorsResult.rows;

    res.render("admin_views/author", {
      title: "Autorzy",
      cssFile: "admin_author.css",
      autorzy: authors,
    });
  } catch (err) {
    res.render("admin_views/author", {
      title: "Autorzy",
      cssFile: "admin_author.css",
      autorzy: [],
      toast: {
        title: "Error",
        body: `Błąd podczas pobierania listy autorów. ${err.message}`,
      },
    });
  }
});

module.exports = router;
