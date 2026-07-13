const express = require('express');
const router = express.Router();
const { queryAll, queryOne, run } = require('../db');
const sanitizeHtml = require('sanitize-html');

// Настройки XSS-санитизации — убираем все HTML-теги
const SANITIZE_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
};

function sanitizeText(text) {
  return sanitizeHtml(String(text || '').trim(), SANITIZE_OPTIONS);
}

// GET /api/comments/:movieId — комментарии к фильму
router.get('/:movieId', (req, res) => {
  try {
    const { movieId } = req.params;

    // Параметризованный запрос — защита от SQL-инъекций
    const comments = queryAll(
      `SELECT id, user_name, text, created_at
       FROM comments WHERE movie_id = ?
       ORDER BY created_at DESC`,
      [parseInt(movieId, 10)]
    );

    res.json({ comments, total: comments.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/comments — добавить комментарий
router.post('/', (req, res) => {
  try {
    const { user_name, movie_id, text } = req.body;

    // Валидация входных данных
    if (!user_name || !movie_id || !text) {
      return res.status(400).json({ error: 'Все поля обязательны: user_name, movie_id, text' });
    }

    // ✅ XSS-защита: очищаем весь пользовательский ввод
    const safeName = sanitizeText(user_name).slice(0, 100);
    const safeText = sanitizeText(text).slice(0, 2000);

    if (!safeName || !safeText) {
      return res.status(400).json({ error: 'Имя и текст не могут быть пустыми' });
    }

    if (safeText.length < 5) {
      return res.status(400).json({ error: 'Комментарий слишком короткий (минимум 5 символов)' });
    }

    // Проверяем существование фильма
    const movie = queryOne('SELECT id FROM movies WHERE id = ?', [parseInt(movie_id, 10)]);
    if (!movie) {
      return res.status(404).json({ error: 'Фильм не найден' });
    }

    // ✅ Параметризованный INSERT — защита от SQL-инъекций
    const result = run(
      `INSERT INTO comments (user_name, movie_id, text) VALUES (?, ?, ?)`,
      [safeName, parseInt(movie_id, 10), safeText]
    );

    const newComment = queryOne(
      'SELECT id, user_name, text, created_at FROM comments WHERE id = ?',
      [result.lastInsertRowid]
    );

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
