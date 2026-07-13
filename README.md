# 🎬 КиноКлуб Казахстан

Легальное социальное сообщество для любителей кино в Казахстане.

## Архитектура

```
kaz-kinoclub/
├── backend/    # Node.js + Express + SQLite API (порт 4000)
└── frontend/   # Next.js 14 + Tailwind CSS (порт 3000)
```

## Запуск

### 1. Бэкенд (API + База данных)

```bash
cd backend
npm install
npm start
# Сервер: http://localhost:4000
# База данных заполняется автоматически при первом запуске
```

### 2. Фронтенд

```bash
cd frontend
npm install
npm run dev
# Приложение: http://localhost:3000
```

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/movies | Все фильмы (поиск: ?q=запрос) |
| GET | /api/movies/:id | Один фильм |
| GET | /api/comments/:movieId | Комментарии к фильму |
| POST | /api/comments | Добавить комментарий |
| GET | /api/health | Проверка статуса |

## Безопасность

- ✅ **XSS-защита**: `sanitize-html` очищает весь пользовательский ввод
- ✅ **SQL-инъекции**: параметризованные запросы `better-sqlite3`
- ✅ **Rate Limiting**: `express-rate-limit` (200 req / 15 min)
- ✅ **Helmet**: безопасные HTTP-заголовки
- ✅ **CORS**: только разрешённые origins
- ✅ **Body limit**: 10kb max payload

## Структура БД

```sql
-- Фильмы
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  poster_url TEXT,
  partner_link TEXT,      -- ссылка на Кинопоиск
  genre TEXT,
  year INTEGER,
  rating REAL
);

-- Комментарии
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  user_name TEXT,
  movie_id INTEGER REFERENCES movies(id),
  text TEXT,              -- XSS-санитизированный
  created_at DATETIME
);
```
