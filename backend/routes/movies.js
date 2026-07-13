const express = require('express');
const router = express.Router();
const { queryAll, queryOne } = require('../db');

// GET /api/movies — все фильмы (с поиском)
router.get('/', (req, res) => {
  try {
    const { q } = req.query;

    let movies;
    if (q && q.trim()) {
      const pattern = `%${q}%`;
      // Параметризованный запрос — защита от SQL-инъекций
      movies = queryAll(
        `SELECT id, title, description, poster_url, partner_link, genre, year, rating
         FROM movies
         WHERE title LIKE ? OR description LIKE ? OR genre LIKE ?
         ORDER BY rating DESC`,
        [pattern, pattern, pattern]
      );
    } else {
      movies = queryAll(
        `SELECT id, title, description, poster_url, partner_link, genre, year, rating
         FROM movies ORDER BY rating DESC`
      );
    }

    res.json({ movies, total: movies.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/movies/:id — один фильм
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Параметризованный запрос — защита от SQL-инъекций
    const movie = queryOne(
      `SELECT id, title, description, poster_url, partner_link, genre, year, rating
       FROM movies WHERE id = ?`,
      [parseInt(id, 10)]
    );

    if (!movie) {
      return res.status(404).json({ error: 'Фильм не найден' });
    }

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
