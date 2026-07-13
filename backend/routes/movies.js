const express = require('express');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''; // user will set this in Render
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Map textual genres from frontend to TMDB numeric IDs
const GENRE_MAP = {
  'drama_comedy': '18,35',
  'action_thriller': '28,53',
  'horror': '27',
  'sci_fi_fantasy': '878,14',
  'romance_mystery': '10749,9648',
  'adventure_western': '12,37',
  'history': '36',
  'music': '10402',
  'noir': '80',
  'documentary': '99',
  'cartoon': '16',

  // Для совместимости со старыми ссылками
  'drama': '18',
  'драма': '18',
  'fiction': '878',
  'фантастика': '878',
  'action': '28',
  'боевик': '28',
  'comedy': '35',
  'комедия': '35',
  'ужасы': '27',
  'мультфильмы': '16'
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
  
  // Оптимизация партнёрской ссылки: используем imdb_id если он есть (Кинопоиск поймёт и сразу перекинет на фильм)
  const searchQuery = tmdbMovie.imdb_id ? tmdbMovie.imdb_id : encodeURIComponent(tmdbMovie.title || tmdbMovie.original_title);
  
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.original_title,
    description: tmdbMovie.overview || 'Описание отсутствует.',
    poster_url: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
    partner_link: `https://www.kinopoisk.ru/index.php?kp_query=${searchQuery}`,
    genre: genreText,
    year: year,
    rating: tmdbMovie.vote_average || 0,
    release_date: tmdbMovie.release_date || null
  };
}

// GET /api/movies — все фильмы (с поиском и фильтром)
router.get('/', async (req, res) => {
  try {
    const { q, genres } = req.query;
    const inputGenres = genres || req.query.genre;
    const inputYears = req.query.years || req.query.year;
    const page = req.query.page || 1;

    if (!TMDB_API_KEY) {
      console.warn("TMDB_API_KEY is not set!");
      return res.json({ movies: [], total: 0 });
    }

    let url = '';
    let targetGenreIds = [];
    let targetYears = [];
    
    if (inputGenres) {
      const parts = inputGenres.split(',');
      for (const p of parts) {
        const mapped = GENRE_MAP[p.trim().toLowerCase()];
        if (mapped) {
          mapped.split(',').forEach(id => targetGenreIds.push(Number(id)));
        }
      }
      targetGenreIds = [...new Set(targetGenreIds)];
    }

    if (inputYears) {
      targetYears = inputYears.split(',').map(y => y.trim()).filter(Boolean);
    }
    
    if (q && q.trim()) {
      url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=ru-RU&query=${encodeURIComponent(q.trim())}&page=${page}&include_adult=false`;
      if (targetYears.length === 1) {
        url += `&primary_release_year=${targetYears[0]}`;
      } else if (targetYears.length > 1) {
        // search/movie in TMDB doesn't support date range, so we'll just filter manually later
      }
    } else {
      url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=ru-RU&sort_by=popularity.desc&page=${page}`;
      
      if (targetGenreIds.length > 0) {
        url += `&with_genres=${targetGenreIds.join(',')}`;
      }
      
      if (targetYears.length === 1) {
        url += `&primary_release_year=${targetYears[0]}`;
      } else if (targetYears.length > 1) {
        const yearsNum = targetYears.map(Number);
        const minYear = Math.min(...yearsNum);
        const maxYear = Math.max(...yearsNum);
        url += `&primary_release_date.gte=${minYear}-01-01&primary_release_date.lte=${maxYear}-12-31`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TMDB responded with ${response.status}`);
    }
    
    const data = await response.json();
    let results = data.results || [];
    
    // Ручная фильтрация для жанров при поиске
    if (q && q.trim() && targetGenreIds.length > 0) {
      results = results.filter(m => {
        const ids = m.genre_ids || [];
        return targetGenreIds.every(id => ids.includes(id));
      });
    }

    // Ручная фильтрация годов (если выбрано несколько, так как TMDB мог вернуть фильмы между min и max годами, которые не выбраны)
    if (targetYears.length > 1) {
      results = results.filter(m => {
        if (!m.release_date) return false;
        const mYear = m.release_date.substring(0, 4);
        return targetYears.includes(mYear);
      });
    }
    
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

    // Запрашиваем 5 страниц (20 * 5 = 100 фильмов)
    const [page1Res, page2Res, page3Res, page4Res, page5Res] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=1`),
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=2`),
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=3`),
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=4`),
      fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=ru-RU&page=5`)
    ]);

    if (!page1Res.ok || !page2Res.ok || !page3Res.ok || !page4Res.ok || !page5Res.ok) {
      throw new Error(`TMDB responded with error`);
    }

    const data1 = await page1Res.json();
    const data2 = await page2Res.json();
    const data3 = await page3Res.json();
    const data4 = await page4Res.json();
    const data5 = await page5Res.json();
    
    const results = [
      ...(data1.results || []),
      ...(data2.results || []),
      ...(data3.results || []),
      ...(data4.results || []),
      ...(data5.results || [])
    ];
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

    // Подтягиваем официальный трейлер с YouTube
    try {
      const videosResRu = await fetch(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=ru-RU`);
      let trailer = null;
      if (videosResRu.ok) {
        const videosDataRu = await videosResRu.json();
        trailer = (videosDataRu.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
      }

      // Фолбэк на оригинальный трейлер (без языка), если на русском нет
      if (!trailer) {
        const videosResEn = await fetch(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`);
        if (videosResEn.ok) {
          const videosDataEn = await videosResEn.json();
          trailer = (videosDataEn.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }
      }

      if (trailer && trailer.key) {
        movie.youtube_key = trailer.key;
      }
    } catch (e) {
      console.error('Ошибка при получении трейлера:', e);
    }

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
