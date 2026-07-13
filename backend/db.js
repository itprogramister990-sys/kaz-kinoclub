const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'kinoclub.db');

let db = null;
let SqlJs = null;

// Инициализация и загрузка БД
async function initDb() {
  if (db) return db;

  SqlJs = await initSqlJs();

  // Загружаем существующую БД или создаём новую
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SqlJs.Database(fileBuffer);
  } else {
    db = new SqlJs.Database();
  }

  createSchema();
  return db;
}

// Сохранение БД на диск
function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Создание схемы
function createSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      poster_url TEXT,
      partner_link TEXT,
      genre TEXT,
      year INTEGER,
      rating REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      movie_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    );

    CREATE INDEX IF NOT EXISTS idx_comments_movie_id ON comments(movie_id);
  `);
  saveDb();
}

// Выполнить SELECT и вернуть массив объектов
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Выполнить SELECT и вернуть один объект или null
function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows[0] || null;
}

// Выполнить INSERT/UPDATE/DELETE и вернуть lastInsertRowid
function run(sql, params = []) {
  db.run(sql, params);
  const result = queryOne('SELECT last_insert_rowid() as id');
  saveDb();
  return { lastInsertRowid: result ? result.id : null };
}

module.exports = { initDb, queryAll, queryOne, run, saveDb };
