const express = require('express');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''; // user will set this in Render
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Map textual genres from frontend to TMDB numeric IDs
const GENRE_MAP = {
  'drama': 18,
  'драма': 18,
  'fiction': 878, // Science Fiction
  'фантастика': 878,
  'action': 28,
  'боевик': 28,
  'comedy': 35,
  'комедия': 35,
  'horror': 27,
  'ужасы': 27,
  'cartoon': 16,
  'мультфильмы': 16
};

// Map TMDB IDs back to textual genres for display
const TMDB_GENRES_REVERSE = {
  18: 'Драма',
  878: 'Фантастика',
  28: 'Боевик',
  35: 'Комедия',
  12: 'Приключения',
  16: 'Мультфильм',
  80: 'Криминал',
  99: 'Документальный',
  10751: 'Семейный',
  14: 'Фэнтези',
  36: 'История',
  27: 'Ужасы',
  10402: 'Музыка',
  9648: 'Детектив',
  10749: 'Мелодрама',
  53: 'Триллер',
  10752: 'Военный',
  37: 'Вестерн'
};

function formatMovie(tmdbMovie) {
  let genreTexts = [];
  if (tmdbMovie.genre_ids) {
    genreTexts = tmdbMovie.genre_ids.map(id => TMDB_GENRES_REVERSE[id]).filter(Boolean);
  } else if (tmdbMovie.genres) {
    genreTexts = tmdbMovie.genres.map(g => TMDB_GENRES_REVERSE[g.id]).filter(Boolean);
  }
  const genreText = genreTexts.length > 0 ? genreTexts.join(', ') : 'Кино';
  const year = tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.substring(0, 4), 10) : 0;
  
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.original_title,
    description: tmdbMovie.overview || 'Описание отсутствует.',
    poster_url: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
    partner_link: `https://www.kinopoisk.ru/index.php?kp_query=${encodeURIComponent(tmdbMovie.title || tmdbMovie.original_title)}`,
    genre: genreText,
    year: year,
    rating: tmdbMovie.vote_average || 0
  };
}

// GET /api/movies — все фильмы (с поиском и фильтром)
router.get('/', async (req, res) => {
  try {
    const { q, genre } = req.query;

    if (!TMDB_API_KEY) {
      console.warn("TMDB_API_KEY is not set!");
      return res.json({ movies: [], total: 0 });
    }

    let url = '';
    
    if (q && q.trim()) {
      url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=ru-RU&query=${encodeURIComponent(q.trim())}&page=1`;
    } else {
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=ru-RU&sort_by=popularity.desc&page=1`;
      
      if (genre && GENRE_MAP[genre.toLowerCase()]) {
        url += `&with_genres=${GENRE_MAP[genre.toLowerCase()]}`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB responded with ${response.status}`);
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    // Преобразуем формат TMDB в наш внутренний формат
    const movies = results.map(formatMovie);

    res.json({ movies, total: movies.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обращении к TMDB' });
  }
});

// GET /api/movies/top — топ лучших фильмов
router.get('/top', async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: 'TMDB_API_KEY is missing' });
    }

    // Запрашиваем 2 страницы для большего количества фильмов (20 * 2 = 40 фильмов)
    const [page1Res, page2Res] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`),
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=2`)
    ]);

    if (!page1Res.ok || !page2Res.ok) {
      throw new Error(`TMDB responded with error`);
    }

    const data1 = await page1Res.json();
    const data2 = await page2Res.json();
    
    const results = [...(data1.results || []), ...(data2.results || [])];
    const movies = results.map(formatMovie);

    res.json({ movies, total: movies.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/movies/:id — один фильм
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: 'TMDB_API_KEY is missing' });
    }

    const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=ru-RU`;
    const response = await fetch(url);

    if (response.status === 404) {
      return res.status(404).json({ error: 'Фильм не найден' });
    }

    if (!response.ok) {
      throw new Error(`TMDB responded with ${response.status}`);
    }

    const data = await response.json();
    const movie = formatMovie(data);

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
