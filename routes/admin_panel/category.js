const express = require("express");
const router = express.Router();
const requireAuth = require("../../public/scripts/requireAuth");
const pool = require("../../db");

router.get("/", requireAuth, async (req, res) => {
  try {
    const categoriesResult = await pool.query(`SELECT 
    k.nazwa AS kategoria,
    COUNT(DISTINCT ks.ksiazka_id) AS ilosc_ksiazek,
    (SELECT CONCAT(a.imie, ' ', a.nazwisko)
     FROM project.ksiazka_autor ka
     JOIN project.autor a ON ka.autor_id = a.autor_id
     WHERE ka.ksiazka_id IN (
         SELECT ks.ksiazka_id
         FROM project.ksiazka ks
         WHERE ks.kategoria_id = k.kategoria_id
     )
     GROUP BY a.autor_id
     ORDER BY COUNT(ka.ksiazka_id) DESC
     LIMIT 1) AS najpopularniejszy_autor
    FROM 
        project.kategoria k
    LEFT JOIN 
        project.ksiazka ks ON k.kategoria_id = ks.kategoria_id
    GROUP BY 
        k.kategoria_id
    ORDER BY 
        k.nazwa;
    `);
    const categories = categoriesResult.rows;
    res.render("admin_views/category", {
      title: "Kategorie",
      cssFile: "admin_category.css",
      kategorie: categories,
    });
  } catch (err) {
    res.render("admin_views/category", {
      title: "Kategorie",
      cssFile: "admin_category.css",
      kategorie: [],
      toast: {
        title: "Error",
        body: `Wystapił błąd ${err}`,
      },
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.render("admin_views/category", {
      title: "Kategorie",
      cssFile: "admin_category.css",
      kategorie: [],
      toast: {
        title: "Error",
        body: "Nazwa kategorii nie może być pusta.",
      },
    });
  }

  try {
    const query = "INSERT INTO project.kategoria (nazwa) VALUES ($1)";
    await pool.query(query, [name]);

    const categoriesResult = await pool.query(`SELECT 
      k.nazwa AS kategoria,
      COUNT(DISTINCT ks.ksiazka_id) AS ilosc_ksiazek,
      (SELECT CONCAT(a.imie, ' ', a.nazwisko)
       FROM project.ksiazka_autor ka
       JOIN project.autor a ON ka.autor_id = a.autor_id
       WHERE ka.ksiazka_id IN (
           SELECT ks.ksiazka_id
           FROM project.ksiazka ks
           WHERE ks.kategoria_id = k.kategoria_id
       )
       GROUP BY a.autor_id
       ORDER BY COUNT(ka.ksiazka_id) DESC
       LIMIT 1) AS najpopularniejszy_autor
      FROM 
          project.kategoria k
      LEFT JOIN 
          project.ksiazka ks ON k.kategoria_id = ks.kategoria_id
      GROUP BY 
          k.kategoria_id
      ORDER BY 
          k.nazwa;
      `);
    const categories = categoriesResult.rows;
    res.render("admin_views/category", {
      title: "Kategorie",
      cssFile: "admin_category.css",
      kategorie: categories,
      toast: {
        title: "Sukces",
        body: `Poprawnie dodano kategorię`,
      },
    });
  } catch (err) {
    res.render("admin_views/category", {
      title: "Kategorie",
      cssFile: "admin_category.css",
      kategorie: [],
      toast: {
        title: "Error",
        body: `Wystapił błąd ${err}`,
      },
    });
  }
});

module.exports = router;
