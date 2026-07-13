const { queryOne, run } = require('./db');

function seedDatabase() {
  console.log('✅ Инициализация базы данных завершена. Локальные фильмы больше не используются (TMDB API).');
}

module.exports = { seedDatabase };
