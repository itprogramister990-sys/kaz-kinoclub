const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDb } = require('./db');
const { seedDatabase } = require('./seed');

const moviesRouter = require('./routes/movies');
const commentsRouter = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Безопасность ────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate limiting — защита от брутфорса
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много запросов, попробуйте позже.' },
});
app.use(limiter);

// CORS — разрешаем запросы отовсюду
app.use(cors());

app.use(express.json({ limit: '10kb' }));

// ─── Маршруты ────────────────────────────────────────────────────────────────
app.use('/api/movies', moviesRouter);
app.use('/api/comments', commentsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ─── Запуск ──────────────────────────────────────────────────────────────────
async function start() {
  try {
    // Инициализируем БД (async для sql.js)
    await initDb();
    seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n🎬 КиноКлуб Казахстан — Backend API`);
      console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
      console.log(`📡 API доступно на: http://localhost:${PORT}/api`);
      console.log(`⏹  Остановить: Ctrl+C\n`);
    });
  } catch (err) {
    console.error('❌ Ошибка запуска:', err);
    process.exit(1);
  }
}

start();
