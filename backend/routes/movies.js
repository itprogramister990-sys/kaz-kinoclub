const express = require('express');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''; // user will set this in Render
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Map textual genres from frontend to TMDB numeric IDs
const GENRE_MAP = {
  'drama': 18,
  'fiction': 878, // Science Fiction
  'action': 28,
  'comedy': 35
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
  const genreId = tmdbMovie.genre_ids ? tmdbMovie.genre_ids[0] : (tmdbMovie.genres ? tmdbMovie.genres[0]?.id : null);
  const genreText = genreId ? (TMDB_GENRES_REVERSE[genreId] || 'Кино') : 'Кино';
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
