const { queryOne, run } = require('./db');

const MOCK_MOVIES = [
  {
    title: 'Интерстеллар',
    description: 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в путешествие, превосходящее границы нашей Галактики, чтобы узнать, есть ли у человечества будущее.',
    poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIe.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/258687/',
    genre: 'Фантастика / Драма',
    year: 2014,
    rating: 8.6,
  },
  {
    title: 'Побег из Шоушенка',
    description: 'Бэнкер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием, царящими по обе стороны решётки. Каждый, кто попадает в эти стены, мечтает об одном — выбраться на свободу.',
    poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/326/',
    genre: 'Драма',
    year: 1994,
    rating: 9.2,
  },
  {
    title: 'Крёстный отец',
    description: 'Криминальная сага о могущественной итало-американской семье Корлеоне. Глава семьи — Дон Вито Корлеоне — настоящий лев, умелый, жёсткий и при этом справедливый. Вынужденный отстаивать своё место под солнцем, он постепенно теряет всё, что дорого ему.',
    poster_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLlegkAo22aB.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/2410/',
    genre: 'Криминал / Драма',
    year: 1972,
    rating: 9.0,
  },
  {
    title: 'Тёмный рыцарь',
    description: 'Когда угроза, известная под именем Джокер, появляется из хаоса и сеет анархию среди жителей Готэма, Бэтмен вынужден принять один из наиболее сложных психологических и физических тестов в своей борьбе с несправедливостью.',
    poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/41520/',
    genre: 'Боевик / Фантастика',
    year: 2008,
    rating: 8.9,
  },
  {
    title: 'Список Шиндлера',
    description: 'Немецкий промышленник Оскар Шиндлер использует евреев из краковского гетто как дешёвую рабочую силу для своего завода. Однако, когда эти люди оказываются под угрозой уничтожения, он тратит целое состояние на их спасение.',
    poster_url: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/217/',
    genre: 'Биография / Драма',
    year: 1993,
    rating: 8.9,
  },
  {
    title: 'Властелин колец: Возвращение короля',
    description: 'Война за Средиземье вступает в завершающую стадию. Фродо и Сэм с каждым шагом приближаются к Мордору. Перед Арагорном стоит задача возглавить Войско мертвецов и собрать все свободные народы, чтобы дать последний бой силам Тьмы.',
    poster_url: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/32756/',
    genre: 'Фэнтези / Приключения',
    year: 2003,
    rating: 8.9,
  },
  {
    title: 'Форрест Гамп',
    description: 'История жизни добросердечного тугодума из Алабамы: он бегает быстрее всех, играл в американский футбол, воевал во Вьетнаме, занимался пинг-понгом и ловил креветок.',
    poster_url: 'https://image.tmdb.org/t/p/w500/h5J4W4veyxMXDMjeMLxOs6AsD44.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/448/',
    genre: 'Драма / Мелодрама',
    year: 1994,
    rating: 8.7,
  },
  {
    title: 'Начало',
    description: 'Кобб — опытный вор, лучший в искусстве извлечения ценной информации из человеческого подсознания во время сна. Ему предлагают шанс на искупление: в сознание жертвы нужно не извлечь идею, а внедрить её.',
    poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/447301/',
    genre: 'Фантастика / Триллер',
    year: 2010,
    rating: 8.7,
  },
  {
    title: 'Матрица',
    description: 'Хакер Нео узнаёт, что его мир — не что иное, как иллюзия, созданная машинами, а люди — источник их энергии. Вместе с группой повстанцев он вступает в борьбу с системой.',
    poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/301/',
    genre: 'Фантастика / Боевик',
    year: 1999,
    rating: 8.5,
  },
  {
    title: 'Зелёная миля',
    description: 'Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора». Однажды в блок приводят Джона Коффи — огромного мужчину с добрым сердцем и таинственным даром исцеления.',
    poster_url: 'https://image.tmdb.org/t/p/w500/velWPhVImage3ARTTPqYeCnopp1s.jpg',
    partner_link: 'https://www.kinopoisk.ru/film/435/',
    genre: 'Драма / Фэнтези',
    year: 1999,
    rating: 8.6,
  },
];

const MOCK_COMMENTS = [
  { user_name: 'Айгерим', movie_id: 1, text: 'Невероятный фильм! Смотрела три раза и каждый раз плачу от финала.' },
  { user_name: 'Нурлан', movie_id: 1, text: 'Нолан снова доказывает, что он гений. Визуальные эффекты просто космические.' },
  { user_name: 'Дана', movie_id: 2, text: 'Лучший фильм всех времён. Каждое слово, каждая сцена — на своём месте.' },
  { user_name: 'Арман', movie_id: 2, text: 'Моргана Фримана обожаю, здесь он великолепен!' },
  { user_name: 'Жанар', movie_id: 3, text: 'Классика, которую должен посмотреть каждый. Марлон Брандо неподражаем.' },
  { user_name: 'Серик', movie_id: 4, text: 'Хит Леджер в роли Джокера — лучшая роль злодея в истории кино.' },
  { user_name: 'Мадина', movie_id: 5, text: 'Смотрела с папой, оба рыдали. Потрясающая история.' },
  { user_name: 'Рустем', movie_id: 8, text: 'Каждый раз смотрю и нахожу что-то новое. Гениальный сценарий!' },
];

function seedDatabase() {
  const existing = queryOne('SELECT COUNT(*) as count FROM movies');
  if (existing && existing.count > 0) {
    console.log('✅ База данных уже содержит данные, пропускаем заполнение.');
    return;
  }

  console.log('🎬 Заполняем базу данных тестовыми данными...');

  for (const movie of MOCK_MOVIES) {
    run(
      `INSERT INTO movies (title, description, poster_url, partner_link, genre, year, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [movie.title, movie.description, movie.poster_url, movie.partner_link, movie.genre, movie.year, movie.rating]
    );
  }
  console.log(`✅ Добавлено ${MOCK_MOVIES.length} фильмов.`);

  for (const comment of MOCK_COMMENTS) {
    run(
      `INSERT INTO comments (user_name, movie_id, text) VALUES (?, ?, ?)`,
      [comment.user_name, comment.movie_id, comment.text]
    );
  }
  console.log(`✅ Добавлено ${MOCK_COMMENTS.length} комментариев.`);
  console.log('🚀 База данных готова!');
}

module.exports = { seedDatabase };
